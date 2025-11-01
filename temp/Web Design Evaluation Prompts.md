Web Design Evaluation Prompts
System Prompt
You are an expert web design evaluator tasked with analyzing the HTML of a given webpage and scoring it against specific design principles inspired by the W3C Design Principles. Your role is to provide a detailed assessment for each principle, assigning a score from 0 to 100, referencing the relevant section of the W3C Design Principles document (https://www.w3.org/TR/design-principles/), and offering a concise yet informative explanation for each score. The principles you will evaluate include: Simplicity, Robustness, Accessibility, Device Independence, Internationalization, Security, Privacy, Standardization, User Needs, User Experience, Compatibility, and Maintainability. When performing your analysis, examine the HTML structure, attributes, and any inline styles or scripts that may influence adherence to each principle. Ensure your responses are formatted in JSON with the keys: 'score' (an integer from 0 to 100), 'link' (the specific URL to the principle), and 'explanation' (a brief text justifying the score).

Evaluation Prompts
1. Simplicity
Prompt:For the provided HTML, assess how effectively the webpage adheres to the principle of Simplicity, which emphasizes clear, concise, and straightforward design to enhance usability and maintainability. Evaluate based on the following detailed criteria:  

Semantic HTML Usage: Does the HTML utilize semantic elements like <header>, <nav>, <main>, <article>, <section>, and <footer> to clearly define the structure and purpose of content, or does it rely heavily on generic elements like <div> and <span>?  
Element Nesting: Are there excessive levels of nested elements that obscure the code's intent, or is the nesting kept minimal and purposeful?  
Code Clarity: Is the HTML well-organized with consistent indentation, logical grouping of related elements, and minimal clutter, making it easy to read and understand?  
Inline Code: Does the HTML avoid inline styles (e.g., style="...") and inline scripts (e.g., <script>...</script> within the body), which can complicate the structure, or are these kept to a minimum and separated where possible?  
Redundancy: Are there redundant or unnecessary elements that could be simplified without affecting functionality?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#simplicity), and 'explanation' (a concise explanation of the score based on the above criteria).


2. Robustness
Prompt:For the provided HTML, evaluate its adherence to the principle of Robustness, which focuses on creating resilient webpages capable of functioning under varying conditions and handling errors gracefully. Consider the following comprehensive factors:  

Error Handling: Are there mechanisms like alt attributes for <img> elements, fallback content for <video> or <audio>, or default text for interactive elements to ensure functionality when resources fail?  
Graceful Degradation: Does the HTML support older browsers or environments by avoiding reliance on cutting-edge features without fallbacks, ensuring basic usability remains intact?  
Standards Compliance: Are deprecated elements (e.g., <font>, <center>) or non-standard attributes avoided in favor of current HTML specifications?  
Responsive Design: Does the HTML incorporate techniques like fluid layouts or media-specific attributes (e.g., srcset for images) to adapt to different screen sizes and device capabilities?  
Resilience Testing: Would the structure likely maintain integrity if JavaScript or CSS fails to load, or does it collapse without these dependencies?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#robustness), and 'explanation' (a brief justification of the score based on these factors).


3. Accessibility
Prompt:For the provided HTML, analyze its adherence to the principle of Accessibility, ensuring the webpage is usable by people with diverse abilities. Conduct a thorough evaluation using these detailed criteria:  

Alternative Text: Are alt attributes present and descriptive for all <img> elements, and do <a> and <button> elements include title attributes where context is unclear?  
Heading Structure: Is there a logical hierarchy of headings (<h1> through <h6>) that outlines the content structure, avoiding skipped levels or overuse of headings for styling?  
ARIA Implementation: Are ARIA roles, states, and properties (e.g., role="navigation", aria-label) applied appropriately to enhance screen reader compatibility for dynamic or complex content?  
Keyboard Navigation: Can all interactive elements (e.g., links, buttons, forms) be accessed and operated via keyboard, with visible focus indicators (e.g., :focus styles)?  
Semantic Elements: Does the HTML leverage semantic tags to provide meaningful structure for assistive technologies, rather than relying solely on presentation?  
Color and Contrast: Are text and background color combinations (if specified inline) sufficient for readability by users with visual impairments?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#accessibility), and 'explanation' (a concise rationale for the score based on these points).


4. Device Independence
Prompt:For the provided HTML, assess its adherence to the principle of Device Independence, ensuring it functions effectively across various devices and input methods. Evaluate based on these specific and detailed considerations:  

Responsive Techniques: Are media queries, flexible grids, or adaptive images (e.g., <picture> or srcset) used to adjust the layout for different screen sizes and resolutions?  
Flexible Units: Does the HTML employ relative units (e.g., %, em, rem, vw) for dimensions rather than fixed units (e.g., px), promoting adaptability?  
Input Agnosticism: Is the design free of assumptions about input methods (e.g., hover effects requiring a mouse), supporting touch, keyboard, and voice inputs equally?  
Cross-Device Testing: Would the HTML likely render consistently on desktops, tablets, smartphones, and assistive devices without breaking functionality or layout?  
Feature Detection: Are there provisions (e.g., via <noscript> or conditional attributes) to handle cases where certain device features are unavailable?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#device-independence), and 'explanation' (a brief explanation of the score based on these criteria).


5. Internationalization
Prompt:For the provided HTML, evaluate its adherence to the principle of Internationalization, which ensures the webpage supports users from diverse linguistic and cultural backgrounds. Use these detailed criteria for your analysis:  

Language Declaration: Is the lang attribute set on the <html> element (e.g., lang="en") and updated on specific elements where the language changes (e.g., lang="es")?  
Multilingual Support: Does the structure allow for easy adaptation to multiple languages, including right-to-left (RTL) scripts like Arabic or Hebrew, using attributes like dir="rtl"?  
Text Externalization: Is text content separated from the HTML (e.g., via external files or server-side rendering) rather than hard-coded, facilitating translation?  
Character Encoding: Is UTF-8 encoding explicitly declared (e.g., <meta charset="UTF-8">) and are Unicode characters used to support global scripts?  
Cultural Sensitivity: Are date formats, numbers, or other locale-specific elements adaptable rather than fixed to one region?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#internationalization), and 'explanation' (a concise summary of the score based on these factors).


6. Security
Prompt:For the provided HTML, assess its adherence to the principle of Security, focusing on protecting users and data from potential threats. Conduct a detailed evaluation with these criteria:  

HTTPS Usage: Are all resource URLs (e.g., images, scripts, links) using https:// rather than http:// to ensure encrypted connections?  
Script Safety: Are inline <script> tags and on* event attributes (e.g., onclick) avoided or minimized to reduce XSS risks, favoring external scripts with proper sanitization?  
CSP Integration: Is there evidence of Content Security Policy implementation (e.g., via <meta http-equiv="Content-Security-Policy">) to restrict unauthorized resource loading?  
Secure Attributes: Do external links use rel="noopener noreferrer" to prevent window.opener exploits, and are form submissions protected against CSRF (if applicable)?  
Input Validation: Are form elements structured to encourage server-side validation (e.g., appropriate type attributes like type="email")?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#security), and 'explanation' (a brief justification of the score based on these points).


7. Privacy
Prompt:For the provided HTML, evaluate its adherence to the principle of Privacy, ensuring user data is handled responsibly and transparently. Analyze using these detailed factors:  

Data Minimization: Does the HTML avoid unnecessary data collection forms or scripts that might track users without consent?  
Privacy Notices: Are there links to a privacy policy (e.g., <a href="/privacy">) or inline notices explaining data usage?  
Tracking Avoidance: Are third-party tracking scripts (e.g., analytics) absent or opt-in only, respecting user privacy by default?  
User Control: Is there a cookie consent mechanism or similar feature allowing users to manage data preferences?  
Secure Data Handling: Are form inputs (e.g., <input type="password">) designed to protect sensitive information, with no inline exposure of data?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#privacy), and 'explanation' (a concise explanation of the score based on these criteria).


8. Standardization
Prompt:For the provided HTML, assess its adherence to the principle of Standardization, ensuring it aligns with widely accepted web standards for consistency and interoperability. Evaluate with these comprehensive criteria:  

HTML Compliance: Are all elements and attributes standard per the W3C HTML specification, avoiding proprietary extensions (e.g., <marquee>)?  
Validation: Would the HTML pass W3C validation with minimal errors or warnings (e.g., no missing closing tags, no duplicate IDs)?  
Cross-Browser Support: Does the HTML avoid browser-specific features or hacks, ensuring broad compatibility?  
Best Practices: Are standard practices followed, such as using <meta charset="UTF-8"> and avoiding obsolete attributes like align?  
Future-Proofing: Is the code written to align with current standards, reducing the risk of obsolescence?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#do-not-reinvent), and 'explanation' (a brief rationale for the score based on these factors).


9. User Needs
Prompt:For the provided HTML, evaluate its adherence to the principle of User Needs, focusing on how well it addresses real user requirements and goals. Use these detailed considerations:  

Purpose Clarity: Does the HTML structure clearly convey the webpage’s primary purpose (e.g., via a prominent <h1> or <main> content)?  
Feature Relevance: Are included elements and content directly tied to solving user problems, avoiding extraneous features?  
User-Centric Design: Are navigation aids (e.g., <nav>), calls to action (e.g., <button>), and key information prioritized for user benefit?  
Content Focus: Is the HTML free of distractions or irrelevant sections that detract from user goals?  
Feedback Loops: Are there mechanisms (e.g., form confirmations) to reassure users their needs are being met?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#solve-real-problems), and 'explanation' (a concise summary of the score based on these points).


10. User Experience
Prompt:For the provided HTML, assess its adherence to the principle of User Experience, ensuring it provides an intuitive, efficient, and enjoyable interaction. Evaluate with these detailed criteria:  

Navigation: Is the structure (e.g., <nav>, <a> hierarchy) logical and easy to follow, with consistent link placement?  
Visual Hierarchy: Do headings, spacing, and element placement guide users naturally through the content?  
Feedback: Are interactive elements (e.g., <button>, <form>) designed to provide clear responses to user actions (e.g., via attributes or states)?  
Aesthetics: Does the HTML support a clean, uncluttered design (e.g., minimal inline styles) that enhances usability?  
Performance: Are heavy resources (e.g., large <img> files) optimized, and is inline script usage minimized to avoid delays?  
Consistency: Are design patterns (e.g., button placement, link styles) uniform across the page?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#priority-of-constituencies), and 'explanation' (a brief justification of the score based on these factors).


11. Compatibility
Prompt:For the provided HTML, evaluate its adherence to the principle of Compatibility, ensuring it works seamlessly across different browsers and environments. Analyze using these comprehensive criteria:  

Cross-Browser Testing: Does the HTML use universally supported elements and attributes, avoiding browser-specific quirks?  
Feature Fallbacks: Are there fallbacks (e.g., <noscript>, polyfill references) for modern features that older browsers might not support?  
Graceful Degradation: Does the page remain functional in browsers lacking certain capabilities (e.g., no JavaScript)?  
Vendor Prefixes: Are inline styles free of vendor-specific prefixes (e.g., -webkit-), relying instead on standard properties?  
Testing Readiness: Is the HTML structured to facilitate easy compatibility testing across platforms?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#test-early), and 'explanation' (a concise explanation of the score based on these points).


12. Maintainability
Prompt:For the provided HTML, assess its adherence to the principle of Maintainability, focusing on how easily it can be updated and managed over time. Evaluate with these detailed factors:  

Code Structure: Is the HTML organized into logical, modular sections with clear separation of content, presentation, and behavior?  
Comments: Are there explanatory comments (e.g., <!-- Navigation Section -->) for complex or non-obvious parts of the code?  
Nesting: Does the HTML avoid excessive nesting that complicates updates, keeping the structure shallow and manageable?  
External Resources: Are styles and scripts externalized (e.g., <link>, <script src>), reducing inline code that’s harder to maintain?  
Consistency: Are naming conventions (e.g., IDs, classes) and formatting (e.g., indentation) uniform, aiding future edits?  
Scalability: Would adding new content or features be straightforward without refactoring the entire structure?Provide your evaluation in JSON format with the keys: 'score' (an integer from 0 to 100), 'link' (https://www.w3.org/TR/design-principles/#design-long-term), and 'explanation' (a brief rationale for the score based on these criteria).

