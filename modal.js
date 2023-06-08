class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this.shadowRoot.innerHTML = `
      <style>
        #backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(0,0,0,0.75);
          z-index: 10;
          opacity: 0;
          pointer-events: none;
        }

        #modal {
          position: fixed;
          top: 10vh;
          left: 25%;
          width: 50%;
          z-index: 100;
          background-color: white;
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.26);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease-out;
        }

        #main { padding: 1rem; }

        header {
          padding: 1rem;
          border-bottom: 1px solid #ccc;
        }

        ::slotted(h1) {
          font-size: 1.25rem;
          margin: unset;
        }

        #actions {
          border-top: 1px solid #ccc;
          padding: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        #actions button { margin-inline: 0.25rem; }

        :host([opened]) #backdrop,
        :host([opened]) #modal {
          opacity: 1;
          pointer-events: all;
        }

        :host([opened]) #modal { top: 15vh; }

      </style>
      <div id="backdrop"></div>
      <div id="modal">
          <header>
              <slot name="title"></slot>
          </header>
          <section id="main">
              <slot name="main-content"></slot>
          </section>
          <section id="actions">
              <button id="cancel-btn">Cancel</button>
              <button id="confirm-btn">Cofirm</button>
          </section>
      </div>
    `;
    const slots = this.shadowRoot.querySelectorAll("slot");
    slots[1].addEventListener("slotchange", (event) => {
      console.dir(slots[1].assignedNodes());
    });

    const backdrop = this.shadowRoot.getElementById("backdrop");
    const confirmBtn = this.shadowRoot.getElementById("confirm-btn");
    const cancelBtn = this.shadowRoot.getElementById("cancel-btn");

    backdrop.addEventListener("click", this._cancel.bind(this));
    confirmBtn.addEventListener("click", this._confirm.bind(this));
    cancelBtn.addEventListener("click", this._cancel.bind(this));
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this.hasAttribute("opened")) {
      // this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
      // this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
      // this.shadowRoot.querySelector('#modal').style.opacity = 1;
      // this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  static get observedAttributes() {
    return ["opened"];
  }

  _cancel(event) {
    this.hide();
    const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
    event.target.dispatchEvent(cancelEvent);
  }

  _confirm() {
    this.hide();
    const confirmEvent = new Event("confirm");
    this.dispatchEvent(confirmEvent);
  }

  open() {
    this.setAttribute("opened", "");
    this.isOpen = true;
  }

  hide() {
    if (this.hasAttribute("opened")) {
      this.removeAttribute("opened");
    }
    this.isOpen = false;
  }
}

customElements.define("uc-modal", Modal);
