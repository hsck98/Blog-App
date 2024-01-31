tinymce.init({
  selector: '#post-blog',
  plugins: 'table hr wordcount formatpainter emoticons image lists preview',
  menubar: 'false',
  toolbar: "redo undo | alignleft aligncenter alignright alignjustify | hr | blockquote | backcolor fontfamily fontsize fontcolor | bold italic underline strikethrough | indent outdent | lineheight | removeformat | preview code codesample imageoptions emoticons footnotes footnotesupdate formatpainter image insertdatetime link openlink unlink bullist numlist media spellchecker | table | insertfile | wordcount",
});

$("#post-preview").on("click", function() {
  console.log("hello");
  tinymce.get("post-blog").execCommand("mcePreview");
});