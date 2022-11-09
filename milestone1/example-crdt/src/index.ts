import * as Y from 'yjs'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

class CRDTFormat {
  public bold?: Boolean = false;
  public italic?: Boolean = false;
  public underline?: Boolean = false;
};

exports.CRDT = class {
  y: any;
  text: any;
  cb: any;
  updateString: string
  constructor(cb: (update: string, isLocal: Boolean) => void) {
    this.cb = cb;
    this.y = new Y.Doc();
    this.text = this.y.getText();
    this.updateString = ""; 
    this.y.on('update', (update: any) => {
      this.cb(JSON.stringify(Array.from(update)), true);
    });
    ['update', 'insert', 'delete', 'toHTML'].forEach(f => (this as any)[f] = (this as any)[f].bind(this));
  }
  update(update: string) {
    let obj = JSON.parse(update);
    obj = Uint8Array.from(obj);
    Y.applyUpdate(this.y, obj);
  }
  insert(index: number, content: string, format: CRDTFormat) {
    this.text.insert(index, content, format);
  }
  delete(index: number, length: number) {
    this.text.delete(index, length);
  }
  toHTML() {
    let html = '(fill me in)';
    var converter = new QuillDeltaToHtmlConverter(this.text.toDelta());
    html = converter.convert();
    return html;
  }
};
