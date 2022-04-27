<template>
    <div>
        <label class="v-label text-caption">{{ label }}</label>

        <div class="mb-5 mt-2">
            <v-layout
                v-if="editor"
                align-center
                wrap
            >
                <template v-if="!isHtmlMode">
                    <v-flex
                        v-for="(button, key) in buttons"
                        :key="key"
                        shrink
                        class="px-2"
                    >
                        <v-btn
                            fab
                            x-small
                            :color="
                                isActiveButton(button.id) ? 'primary' : null
                            "
                            @click="
                                () =>
                                    button.handler(
                                        computedEditor.chain().focus()
                                    )
                            "
                        >
                            <v-icon>{{ button.icon }}</v-icon>
                        </v-btn>
                    </v-flex>
                </template>
                <v-spacer />
                <v-flex
                    grow
                    shrink
                >
                    <v-btn
                        :color="isHtmlMode ? 'primary' : 'default'"
                        @click="() => (isHtmlMode = !isHtmlMode)"
                    >
                        html
                    </v-btn>
                </v-flex>
            </v-layout>
        </div>
        <section v-if="isHtmlMode">
            <prism-editor
                v-model="modelValue"
                :highlight="highlighter"
                :tab-size="4"
                class="code-editor"
            />
        </section>
        <section v-else>
            <v-card class="mb-5">
                <v-card-text>
                    <editor-content
                        :editor="editor"
                        class="white black--text"
                    />
                </v-card-text>
            </v-card>
        </section>

        <v-dialog
            v-model="dialogImage"
            :max-width="400"
        >
            <v-card>
                <v-card-title>Seleção da imagem</v-card-title>
                <v-card-text>
                    <app-image-upload
                        label="Selecionar Imagem"
                        name="image"
                        @imageSelected="handleSelectImage"
                    />
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn color="primary">
                        Adicionar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

import { highlight, languages } from 'prismjs';

import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-okaidia.css';

import { Editor, EditorContent } from '@tiptap/vue-2';

import StarterKit from '@tiptap/starter-kit';
import Paragraph from '@tiptap/extension-paragraph';
import Image from '@tiptap/extension-image';

import { CommandButton, generateButtons } from './AppRichTextEditor';
import AppImageUpload from './AppImageUpload.vue';

type Data = {
    editor?: Editor;
    isHtmlMode: boolean;
    buttons: CommandButton[];
    dialogImage: boolean;
}

export default Vue.extend({
    name: 'AppRichTextEditor',

    components: {
        EditorContent,
        PrismEditor,
        AppImageUpload
    },

    props: {
        value: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        }
    },

    data (): Data {
        const buttons = generateButtons();

        return {
            editor: undefined,
            isHtmlMode: false as boolean,
            buttons,
            dialogImage: false
        };
    },

    computed: {
        computedEditor (): Editor {
            return this.editor as Editor;
        },

        modelValue: {
            set (value: string) {
                this.$emit('input', value);
                this.computedEditor.commands.setContent(value, false);
            },
            get (): string {
                return this.value;
            }
        }
    },

    watch: {
        value (value) {
            const isSame = this.computedEditor.getHTML() === value;

            if (isSame) {
                return;
            }

            this.computedEditor.commands.setContent(value, false);
        }
    },

    mounted () {
        this.editor = new Editor({
            content: this.value,
            extensions: [StarterKit, Image, Paragraph.extend({
                parseHTML () {
                    return [{ tag: 'div' }];
                },
                renderHTML ({ HTMLAttributes }) {
                    return ['div', HTMLAttributes, 0];
                }
            })],
            onUpdate: () => {
                this.$emit('input', this.computedEditor.getHTML());
            }
        });
    },

    beforeDestroy () {
        this.computedEditor.destroy();
    },

    methods: {
        isActiveButton (arg: any): boolean {
            if (Array.isArray(arg)) {
                return !!this.computedEditor.isActive(arg[0], arg[1]);
            }

            return !!this.computedEditor.isActive(arg);
        },

        handleSelectImage (imageFile: File) {
            this.$emit('imageSelected', imageFile);
        },
        highlighter (code: string) {
            return highlight(code, languages.html, 'html'); // languages.<insert language> to return html with markup
        }
    }
});
</script>

<style lang="scss" scoped>
/* Basic editor styles */

.code-editor{
    background-color: #0d0d0d;
    color: #f1f1f1;
    white-space: pre;
    padding: 1rem;
    margin-bottom: 1rem;
}

::v-deep .ProseMirror {
    outline: none;

    > * + * {
        margin-top: 0.75em;
    }

    ul,
    ol {
        padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    pre {
        background: #0d0d0d;
        color: #fff;
        font-family: "JetBrainsMono", monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
    }

    img {
        max-width: 100%;
        height: auto;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, 0.1);
        margin: 2rem 0;
    }
}
</style>
