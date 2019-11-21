<template>
  <v-app v-cloak light>
    <nuxt />
  </v-app>
</template>

<style lang="scss">
  body {
    font-family: 'Raleway', sans-serif;
    line-height: 2.2rem;
    font-size: $font-size-root
  }

  // Loading overlay
  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ffffffeb;
    z-index: 9999;
    .v-progress-circular {
      left:50%;
      top: 30vh;
    }
  }
  .noscroll {
    height: 100vh;
    overflow: hidden;
  }
</style>
