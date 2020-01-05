<template>
    <div class="list">
        <h3>List</h3>
        <ul class="list-group">
            <li class="list-group-item"
                v-for="(note, index) in notes"
                :key="note.index"
                :class="{ 'active': index === activeNote}"
                @click="changeNote(index)"
                >
                <div>{{ note.title }}</div>
            </li>
        </ul>
        <button @click="addNote()" class="btn btn-info">+ Workout</button>
    </div>
</template>
 
<script>
export default {
  name: "NoteList",
  props: ["notes", "activeNote"],
  methods: {
    changeNote(index) {
      this.$emit("app-changeNote", index);
    },
    addNote() {
      this.$emit("app-addNote");
    }
  }
};
</script>
 
<style>
.list {
  margin: 20px;
}
</style>
