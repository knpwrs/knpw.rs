/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import g from 'glamorous';
import CenterWrap from '../components/center-wrap';
import siteShape from '../shapes/site';
import excelSetupPng from '../images/excel-setup-diagram.png';

const maLink = <a href="https://www.youtube.com/watch?v=JvUMV1N7eGM">Massachusetts</a>;
const ghLink = <a href="https://github.com/knpwrs">my GitHub</a>;
const patsLink = <a href="http://www.patriots.com/">New England Patriots</a>;
const cdpLink = <a href="http://cursordanceparty.com">New England Patriots</a>;
const esdLink = <a href={excelSetupPng}>full setup diagram</a>;

const ResumeHeader = g.header({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  '> h5': {
    margin: 0,
  },
});

const About = ({ data: { site: { siteMetadata: site } } }) => (
  <CenterWrap>
    <Helmet>
      <title>About &middot; {site.title}</title>
    </Helmet>
    <h2>About</h2>
    <blockquote>
      <p>
        &quot;Far away across the oceans. An undiscovered paradise. Forget New
        York and California. There’s a better place – now close your eyes. Take
        my hand.  We are almost there. Our favorite place on Earth.&quot; -
        Ylvis
      </p>
    </blockquote>
    <p>
      I am a software engineer living and working in {maLink}. I work
      extensively in Universal JavaScript and HTML5 and have experience in many
      other technologies. Take a look at {ghLink} to see my personal projects.
    </p>
    <p>
      I also enjoy music, play drums and bass guitar, and am a big time fan of
      the {patsLink}. Feel free to take a look around and contact me with any
      questions.
    </p>
    <h3>Résumé</h3>
    <h4>Languages</h4>
    <ul>
      <li>Proficient in: JavaScript (Universal Node / Browser), HTML5, CSS3 (SCSS)</li>
      <li>Familiar with: C# and .NET Framework, Java, Scala, Ruby, Swift, SQL</li>
    </ul>
    <h4>Software</h4>
    <ul>
      <li>Database: PostgreSQL, MySQL, SQL Server, MongoDB, Redis</li>
      <li>Server: nginx, Apache httpd</li>
      <li>Tools: Docker, Git, Jenkins, Travis CI</li>
      <li>Platforms: macOS, Linux / Unix, Microsoft Windows</li>
    </ul>
    <h4>Experience</h4>
    <ResumeHeader>
      <h5>Candescent Health &middot; Software Engineer &middot; Remote (Waltham, MA)</h5>
      <h5>April 2016 - August 2017</h5>
    </ResumeHeader>
    <ul>
      <li>Worked with React, Redux, Vue, Angular, Node, PHP, MySQL, and Docker.</li>
      <li>Used Flyway for database migrations across multiple client environments.</li>
      <li>Designed and created a dashboard for monitoring doctors and their workloads across multiple facilities.</li>
      <li>Prototyped Electron applications with native integrations.</li>
      <li>Open-sourced a Babel plugin for automatic dependency injection in Angular.</li>
      <li>Presented multiple tech talks on modern JavaScript and CSS best practices.</li>
    </ul>
    <ResumeHeader>
      <h5>IBM &middot; Staff Software Engineer &middot; Littleton, MA</h5>
      <h5>January 2013 - April 2016</h5>
    </ResumeHeader>
    <ul>
      <li>Worked with React, Redux, Dojo, and OpenSocial, continually integrating bleeding-edge web technologies.</li>
      <li>Focused on modular, high-performance code capable of running in varying environments with varying content security policies.</li>
      <li>Developed front-end request layer mimicking Dojo’s request API providing automatic reauthentication with no changes required to
client code.</li>
      <li>Automated builds and deployments with Jenkins.</li>
      <li>Conducted technical interviews for intern and new hire candidates.</li>
      <li>Contributed Less Compilation to OpenNTF JavaScript Aggregator.</li>
      <li>Prototyped PostCSS / AutoPrefixer support for OpenNTF JavaScript Aggregator.</li>
      <li>Created a mock browser environment for load testing Verse’s offline capabilities.</li>
      <li>Created shim for testing New Relic Synthetics offline.</li>
    </ul>
    <ResumeHeader>
      <h5>IBM &middot; Smarter Cities Technical Coop &middot; Remote (Raleigh, NC)</h5>
      <h5>August 2012 - November 2012</h5>
    </ResumeHeader>
    <ul>
      <li>Worked with the Dojo Toolkit, OpenStreetMap, and OpenLayers.</li>
      <li>Developed a prototype for an IBM Smarter Cities data visualization product.</li>
    </ul>
    <ResumeHeader>
      <h5>IBM &middot; Extreme Blue Innovation Lab Technical Intern &middot; Austin, TX</h5>
      <h5>May 2012 - August 2012</h5>
    </ResumeHeader>
    <ul>
      <li>Led a team of software developers and business people to create a mobile application development solution targeted at non-technical users.</li>
      <li>Worked with an agile scrum process using Rational Team Concert to manage tasks.</li>
      <li>Worked with several technologies including Java, JavaScript, and HTML5.</li>
      <li>Project features an intuitive drag and drop interface which allows non-technical users to create their own applications out of functional building blocks.</li>
      <li>Presented technical project details to multiple IBM executives.</li>
    </ul>
    <ResumeHeader>
      <h5>Big Y Foods, Inc &middot; Technology Administrator / Systems Development &middot; Springfield, MA</h5>
      <h5>January 2010 - May 2012</h5>
    </ResumeHeader>
    <ul>
      <li>Worked with ASP.NET MVC (C#) and Microsoft SQL Server.</li>
      <li>Created stored procedures for Microsoft SQL Server to generate reports on various data collected from stores.</li>
      <li>Created an internal web application to help corporate employees better manage their daily tasks. Application features on-call phone listing and a time-off request form where corporate employees could find coverage if they needed time off.</li>
    </ul>
    <ResumeHeader>
      <h5>Personal Projects &middot; github.com/knpwrs &middot; knpw.rs</h5>
    </ResumeHeader>
    <ul>
      <li>My personal GitHub profile contains personal projects and contributions to various open source projects. Notable open-source contributions include the MongoDB NodeJS Driver, JSDom, and the Frontend Maven Plugin.</li>
      <li>{cdpLink} is a tech demo of WebSockets and HTML5 Canvas. Users see the cursors of all other connected users as they move around. Survived the front page of reddit.</li>
    </ul>
    <h4>Volunteer Work</h4>
    <ResumeHeader>
      <h5>ExcelChurch &middot; Technical Director &middot; Leominster, MA</h5>
      <h5>February 2013 - Present</h5>
    </ResumeHeader>
    <ul>
      <li>Designed and implemented live production setup using ProPresenter, Reaper, Lightkey, and Wirecast.</li>
      <li>Set up electronic drums to trigger sounds with Superior Drummer and set up external MIDI controller running through the drums to control click tracks, backing tracks, lights, projection, and recording.</li>
      <li>Performed weekly setup and teardown of professional A/V equipment including sound, recording, and projection.</li>
      <li>Provided hands-on training, recorded instructional videos, and wrote documentation for other volunteers.</li>
      <li>See {esdLink}.</li>
    </ul>
    <h4>Education</h4>
    <ResumeHeader>
      <h5>University of Massachusetts Amherst &middot; Amherst, MA &middot; 3.7 GPA</h5>
      <h5>2011 - 2013</h5>
    </ResumeHeader>
    <ul>
      <li>Received Bachelor’s of Science in Computer Science.</li>
      <li>Received two awards for outstanding performance in individual classes.</li>
      <li>Made the Dean’s List three out of four semesters.</li>
    </ul>
    <ResumeHeader>
      <h5>Springfield Technical Community College · Springfield, MA · 3.8 GPA</h5>
      <h5>2009 - 2011</h5>
    </ResumeHeader>
    <ul>
      <li>Received Associate’s of Science in Engineering and Science Transfer (Focus on Computer Science).</li>
      <li>Received two annual awards for outstanding overall performance.</li>
      <li>Completed two directed studies (one in Computer Science and one in Math).</li>
      <li>Made the Dean’s List all four semesters.</li>
    </ul>
  </CenterWrap>
);

About.propTypes = {
  data: PropTypes.shape({
    site: siteShape,
  }).isRequired,
};

export default About;

export const aboutPageQuery = graphql`
  query AboutPageSiteMetadata {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
