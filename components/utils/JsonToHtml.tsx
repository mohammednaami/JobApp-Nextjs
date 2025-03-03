"use client";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";


export function JsonToHtlml({json}: {json: JSONContent}){
      const editor = useEditor({
        extensions: [
          StarterKit,
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          Typography,
        ],
        immediatelyRender: false,
        editorProps: {
          attributes: {
            class:
              "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
          },
        },
        editable: false,
        content: json,
      });

      return <EditorContent editor={editor} />

}