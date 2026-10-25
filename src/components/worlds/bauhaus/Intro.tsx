import { personalInfo } from "@/data/personal";
import Reveal from "./Reveal";

// Who I am, as a typophoto spread: the name at poster scale held by a thick
// red bar (Bayer's Kandinsky poster), the seal as the picture, tilted on its
// own bar, and a colophon of plain facts.
export default function Intro() {
  return (
    <Reveal className="bh-intro" aria-labelledby="bh-h1" id="who">
      <span className="bh-intro-bar" aria-hidden />
      <h1 id="bh-h1" className="bh-h1">
        <span className="bh-h1-a">i&rsquo;m</span>
        <span className="bh-h1-b">ayush.</span>
      </h1>

      <figure className="bh-seal">
        <span className="bh-seal-plate">
          <span lang="ja" className="bh-seal-glyph">
            歩
          </span>
        </span>
        <figcaption className="bh-seal-cap">my seal. 歩, ayu(mu): to walk.</figcaption>
      </figure>

      <div className="bh-intro-copy">
        <p className="bh-intro-lead">
          i&rsquo;m a {personalInfo.title.toLowerCase()} in {personalInfo.location.toLowerCase()}. react and next.js up
          front, spring boot behind, postgres underneath.
        </p>
        <p>
          i like building the whole thing: the service that does the work, the table that keeps it, and the button you
          press to make it happen. most of my days go into healthcare software at agilon health. the rest go into{" "}
          {personalInfo.currentProject.name.toLowerCase()}, {personalInfo.currentProject.blurb}.
        </p>
        <p>
          the bauhaus said form follows function. that&rsquo;s how i like to build: every part has a job, and you can
          see what it does. this room is made the same way: the bars hold the words up, and every shape has a job.
        </p>
      </div>

      <dl className="bh-colophon">
        <div>
          <dt>what</dt>
          <dd>{personalInfo.title.toLowerCase()}</dd>
        </div>
        <div>
          <dt>where</dt>
          <dd>{personalInfo.location.toLowerCase()}</dd>
        </div>
        <div>
          <dt>since 2022</dt>
          <dd>agilon health</dd>
        </div>
        <div>
          <dt>now</dt>
          <dd>{personalInfo.currentProject.name.toLowerCase()}</dd>
        </div>
        <div>
          <dt>handle</dt>
          <dd>devayu</dd>
        </div>
      </dl>
    </Reveal>
  );
}
