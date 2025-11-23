import { Request, Response } from 'express';
import { deleteImages, saveEventImage } from '../utils/imagesUtil';
import {generateEventSlug} from '../utils/slugify';
import path from "path";
import fs from "fs"
import fsPromises from "fs/promises";
import { ZodError } from 'zod';

import {CalendarEventEntry, UpdateCalendarEventSchema} from '../../models/event/EventLog'
import { saveEvent } from '../utils/saveEvent';


 const dirPath = path.join(process.cwd(),"data");
// const dirPath =
//   process.env.NODE_ENV === "production"
//     ? path.join(__dirname, "..", "..", "..", "data")   // project-root/data
//     : path.join(__dirname, "..", "..", "data"); // dev: src/data

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, start, end, date, location, createdBy, published } = req.body;

    const slug = generateEventSlug(title, date);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files["image"]?.[0];

    let response: { image: string, imageThumbnail: string } | null = null;
    if (image) {
      response = await saveEventImage(image, slug);
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }

    const event = {
      title,
      description,
      date,
      start: startDate,
      end: endDate,
      location,
      image: response ? { full: response.image, thumb: response.imageThumbnail } : undefined,
      slug,
      createdBy,
      published,
    };
    try {
    const validateData = CalendarEventEntry.parse(event);
    // console.log("Event", validateData);

    const data = await saveEvent(validateData, "events", "events.json");

    return res.status(200).json({ message: "Event saved", data });
    } catch (error) {
      if (error instanceof ZodError) {
      // Extract first issue message (you can also send all)
      const issue = error.issues[0];
       return res.status(400).json({
          message: issue.message,
          path: issue.path,
        });
    }
    console.error(error);
    return Response.json({ message: "Unexpected server error" }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, start, end, date, location, published  } = req.body;

  console.log("req.body", req.body)

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    try {
      if (!id) {
      return res.status(400).json({ message: "Missing event id" });
    }
    const events = await getJsonEvents()

    const eventIndex = events.findIndex((event: CalendarEventEntry) => event.id === id)
     if (eventIndex === -1) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingEvent = events[eventIndex]

    let newImage = null
    if (files?.image?.[0]) {
      newImage = await saveEventImage(files.image[0], existingEvent)
    }
    const startDate = start ? new Date(start) : existingEvent.start;
    const endDate = end ? new Date(end) : existingEvent.end;
    const updatedEvent = {
      ...existingEvent,
      description: description ?? existingEvent.description,
      start: startDate,
      end: endDate,
      date: date ?? existingEvent.date,
      location: location ?? existingEvent,
      published: published ?? existingEvent.published,
      image: newImage 
      ? {
        full: newImage.image,
        thumb: newImage.imageThumbnail,
      }: existingEvent.image
    }

    const validatedEvent = UpdateCalendarEventSchema.parse(updatedEvent);

    events[eventIndex] = validatedEvent
    const filePath = path.join("data/events", "events.json")
    await fsPromises.writeFile(filePath, JSON.stringify(events, null, 2))

    return res.status(200).json({
      message: 'Event updated',
      event: validatedEvent,
    })

    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating event" });
    }
}
export const getEvent = async (req: Request, res: Response) => {
  const {id } = req.params;
    try {
       if (!id) {
      return res.status(403).json({ message: "Missing credentials" });
    }

    const events = await getJsonEvents()

    const sortedEvents = [...events].sort((a, b) =>
      a.title.localeCompare(b.title)
    )

    const event = sortedEvents.find((event) => event.id === id)

     if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event)

    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving event" });
    }
}

export const getEvents = async (req: Request, res: Response) => {
    try {
    const events = await getJsonEvents()
    
    res.status(200).json(events || [])
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating event" });
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing event ID" });
    }
    const events = await getJsonEvents()
    const sortedEvents = [...events].sort((a, b) => a.title.localeCompare(b.title));

    const index = sortedEvents.findIndex((event) => event.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Event not found" });
    }
    const [deletedEvent] = sortedEvents.splice(index, 1)

    if (deletedEvent?.slug) {
      const slug = deletedEvent.slug
      const dir = "event"
      try {
        await deleteImages(slug, dir)
      } catch (err) {
        console.error(`Error deleting images for ${slug}:`, err)
      }
    }
    const filePath = path.join(dirPath, "events", "events.json")
    await fsPromises.writeFile(filePath, JSON.stringify(sortedEvents, null, 2))

    res.status(200).json({
      message: "Event deleted successfully",
      deleted: deletedEvent,
    })
    
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating event" });
    }
}

async function getJsonEvents() {
  const filePath = path.join(dirPath, "events", "events.json")
//   const file = await fsPromises.readFile(filePath, "utf8");
//   const events = JSON.parse(file)

// return events
try {
    // Ensure directory exists
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true });

    // Use fs.existsSync from 'fs', NOT fs/promises
    if (!fs.existsSync(filePath)) {
      await fsPromises.writeFile(filePath, "[]", "utf8");
      return [];
    }

    const file = await fsPromises.readFile(filePath, "utf8");
    return JSON.parse(file);
  } catch (err) {
    console.error("Error reading events.json:", err);
    return [];
  }
}