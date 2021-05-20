<template>
  <!-- bidirectional data binding（双向数据绑定） -->

  <!-- Or manually control the data synchronization（手动控制数据流）  -->
  <div>
    <div
      :content="text"
      @change="onEditorChange($event)"
      v-quill:myQuillEditor="editorOption"
      class="editor"
    ></div>
  </div>
</template>

<script>
import Quill from "quill";

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

export default {
  props: ["textProp"],
  data() {
    return {
      content: "<p>example content</p>",
      editorOption: { theme: "snow" },
    };
  },
  mounted() {
  },
  computed:{
    text(){
      return this.textProp
    }
  },
  methods: {
    onEditorChange(event) {
      this.$emit("editor-change", event.html);
    },
  },
  // Omit the same parts as in the following component sample code
  // ...
};
</script>

<style>
p{
  font-size:100%;
}
ul {
  padding: 50px;
}
.editor {
  background-color: white;
  font-size:100%
}

</style>