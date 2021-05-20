<template>
  <div class="outer-container">
    <div class="blob"></div>
    <div class="text-container">Live Update</div>
  </div>
</template>

<style scoped>
.outer-container {
  flex-direction: row;
  background-color: #f1f1f1;
  /* max-width: 200px; */
  justify-content: flex-start;
  border-radius: 30px;
  overflow: hidden;
  display: inline-flex;
}

.text-container {
  vertical-align: middle;
  display: flex;
  align-items: center;
  color: #410a0a;
  font-weight: bold;
  padding: 0 1em;
}
.blob {
  background: #410a0a;
  border-radius: 50%;
  margin: 10px;
  height: 10px;
  width: 10px;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(170, 80, 80, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(170, 80, 80, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(170, 80, 80,0);
  }
}
</style>
