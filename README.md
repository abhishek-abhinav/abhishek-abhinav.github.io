# Abhishek Abhinav — AI Automation Portfolio

Static HTML/CSS/JavaScript portfolio, compatible with GitHub Pages.

## Pages
- `index.html` — main AI Automation Lead portfolio
- `projects.html` — searchable/filterable project directory (25 individual case studies)
- `projects/` — one detailed case-study page per project
- `ai-video-portfolio.html` — separate creative video gallery; linked from the homepage creative-skills card and footer, not the main navigation
- `contact.html` — contact form and direct email links

## Video gallery
Open `assets/js/ai-videos.js` and replace an empty URL value:
`{ "url": "https://www.youtube.com/watch?v=VIDEO_ID" }`
No title, description or video file is required. The gallery generates a YouTube thumbnail; clicking it replaces the thumbnail with an embedded player at the same position. It does not send visitors to the channel.

## Videos already embedded
- Homepage showreel: `p1ZDeqnxx1I`, opens in a modal popup.
- WakeUp by TR Analytics AI Agent case study: `_VacomDLu84`, full-width embed on its project page.

YouTube playback requires the video owner to allow embedding and the video to be Public or Unlisted. Test on the hosted GitHub Pages URL; browsers may restrict iframe referrer information when opening the site directly as a `file://` local file.

## Contact form
The contact form is configured to submit to FormSubmit at `abhishekabhinav@zohomail.in`. FormSubmit may require the recipient to approve the first submission by email. Test a real submission after deployment to verify delivery.

## Experience counter
The homepage calculates elapsed years and months dynamically from 1 April 2024. The start date is not printed beside the counter.

## Case-study evidence
Every case-study page includes screenshot placeholders and a commented-out future video embed block, except the Analytics AI Agent page, which already contains its published walkthrough. Replace placeholders with genuine sanitized screenshots and add future video IDs when recordings are ready.

## Deploy
Upload the contents of this folder to the root of the GitHub Pages repository. Keep `assets` and `projects` folders intact. No build step is required.
