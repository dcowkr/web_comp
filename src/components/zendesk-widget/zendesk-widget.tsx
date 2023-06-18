import { Component } from '@stencil/core';

declare let zE: any;

@Component({
  tag: 'zendesk-widget',
  styleUrl: './zendesk-widget.css',
  shadow: true
})
export class ZendeskWidget {
  ZE_ID = 'ze-snippet';
  ZE_SRC = 'https://static.zdassets.com/ekr/snippet.js?key=981b9f1f-aa95-49de-8564-fe79fe82fabf';
   
  loadScript(id: string, src: string) {
    return new Promise<void>(function(resolve) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = src;
      s.id = id;
      s.async = true;
      s.onload = () => {
        // console.log(this.readyState); // uncomment this line to see which ready states are called.
        resolve();
      };
      const t = document.getElementsByTagName('script')[0];
      t.parentElement.insertBefore(s, t);
    });
  }

  zendesk = {
    init: (id: string, src: string) => {
      this.loadScript(id, src);
    },

    widgetAction: (action: string) => {
      zE('messenger', action);
    },
  }

  componentWillLoad() {
    this.zendesk.init(this.ZE_ID, this.ZE_SRC);
    console.log('zendesk loaded')
  }

  launchChat(): void {
    this.zendesk.widgetAction('open');
  }

  render() {
    return [
      <div>
        <button onClick={this.launchChat.bind(this)}>Open Widget</button>
      </div>
    ];
  }
}
