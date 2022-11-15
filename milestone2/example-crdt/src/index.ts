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
  local: boolean 
  constructor(cb: (update: string, isLocal: Boolean) => void) {
    this.cb = cb;
    this.y = new Y.Doc();
    this.text = this.y.getText('quill');
    this.local = true;
    this.y.on('update', (update: any) => {
      this.cb(JSON.stringify(Array.from(update)), this.local);
    });
    ['update', 'insert', 'delete', 'insertImage', 'toHTML'].forEach(f => (this as any)[f] = (this as any)[f].bind(this));
  }
  update(update: string) {
    let obj = JSON.parse(update);
    obj = Uint8Array.from(obj);
    this.local = false;
    Y.applyUpdate(this.y, obj);
  }
  insert(index: number, content: string, format: CRDTFormat) {
    this.local = true;
    this.text.insert(index, content, format);
  }
  delete(index: number, length: number) {
    this.local = true;
    this.text.delete(index, length);
  }
  insertImage(index: number, url: string){
    this.local = true;
    this.text.insertEmbed(index, {image: url});
  }
  toHTML() {
    let html = '(fill me in)';
    var converter = new QuillDeltaToHtmlConverter(this.text.toDelta());
    html = converter.convert();
    return html;
  }
};