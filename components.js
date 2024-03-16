class NetsiPromptExample extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const serviceName = this.getAttribute("servicename");
    const imageURL = this.getAttribute("image-url");
    const prompt = this.getAttribute("prompt");
    const related = this.getAttribute("related");

    let content = "";
    Array.from(this.children).forEach((child) => {
      // Do something with each child
      content += child.outerHTML;
    });

    this.innerHTML = `
        <div class="prompt">
          <h2 class="prompt-title">${
            related ? `<a href="${related}">${serviceName}</a>` : ""
          }</h2>
          <div class="prompt-image">
            <a href="${imageURL}" target="_blank"><img src="${imageURL}" alt="${serviceName}" height="400px" /></a>
          </div>
					<div class="prompt-comment">
          <slot></slot> <!-- This is where your innerHTML content will go -->
        </div>
					${prompt ? `<div class="prompt-text">${prompt}</div>` : ""}
					${content ? content : ""}
        </div>
      `;
  }
}

// Define the new element
customElements.define("netsi-prompt-example", NetsiPromptExample);
