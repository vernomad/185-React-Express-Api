

export type Item = {
  id: number;
  name: string;
  slug: string;
};

export const navData: Item[] = [

    {
        id: 1,
        name: "Home",
        slug: "/"
    },
    {
        id: 2,
        name: "Info",
        slug: "/about"
    },
    {
        id: 3,
        name: "Pro's",
        slug: "/projects"
    },
    {
        id: 4,
        name: "Events",
        slug: "/events"
    },
    {
        id: 5,
        name: "Contact",
        slug: "/contact"
    },
]