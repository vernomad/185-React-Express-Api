import { useUser } from "../../useUser";
import { useMemo } from "react";

export default function CarIcon() {
  const { state } = useUser()

  const currentTheme = state.preferences.theme;

    const colors = useMemo(() => {
    if (currentTheme === "dark") {
      return {
        fill: "#1d1d1dff", 
      };
    } else {
      return {
        fill: "#e0e7e9ff",  
      };
    }
  }, [currentTheme]);
  
  return (

    <svg
      viewBox="0 0 800 250"
      width="800"
      height="250"
      xmlns="http://www.w3.org/2000/svg" 
      fill={colors.fill}
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
    //roof
  <path fill="none" d="M300 120 C340 90, 380 80, 500 101"/>
 
  <path d="M83.8,170.6l-2.4,2.4L205,177l69,1c6,2,246,2,292-4
	l66-7c34-18,18-32-17-47c-85-30-195-20-235,0h-80c-80-5-220,34-220,34l1.7,2.5L83.8,170.6z"/>

  <circle cx="240" cy="170" r="34" />
  <circle cx="600" cy="170" r="34" />

    </svg>
  );
}
