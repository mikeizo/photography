<template>
  <v-chip dark class="mr-2" :color="categoryData.color">
    {{ categoryData.name }}
  </v-chip>
</template>
<script>
export default {
  props: {
    categoryData: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    dialog: false
  })
}
</script>
