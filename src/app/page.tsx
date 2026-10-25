import FrontierChapter from "@/components/journey/chapters/FrontierChapter";
import NightCityChapter from "@/components/journey/chapters/NightCityChapter";
import NoirChapter from "@/components/journey/chapters/NoirChapter";
import YoteiChapter from "@/components/journey/chapters/YoteiChapter";
import Journey from "@/components/journey/Journey";

// One person, four realities, one scroll.
export default function Home() {
  return (
    <Journey>
      <NoirChapter />
      <FrontierChapter />
      <NightCityChapter />
      <YoteiChapter />
    </Journey>
  );
}
