import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Quill from "quill";


let options={
  theme:'snow'
}
    Vue.use(VueQuillEditor, options)


var Link = Quill.import("formats/link");

class MyLink extends Link {
  static create(value) {
    let node = super.create(value);
    value = this.sanitize(value);
    node.setAttribute("href", value);
    console.log("in My Link")
    if (value.startsWith("#")) {
      console.log('removing blank')
      node.removeAttribute("target");
    }
    return node;
  }
}



Quill.register(MyLink);
   