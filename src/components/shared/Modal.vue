<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
  message?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :class="type">
          <div class="modal-header">
            <slot name="header">
              <h3>{{ title || 'Mensaje' }}</h3>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <p>{{ message }}</p>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button v-if="showCancel" class="modal-default-button cancel" @click="$emit('close')">
                {{ cancelText || 'Cancelar' }}
              </button>
              <button class="modal-default-button confirm" @click="$emit('confirm')">
                {{ confirmText || 'Aceptar' }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.modal-default-button.confirm {
  background-color: #d90000;
  color: white;
}

.modal-default-button.confirm:hover {
  background-color: #b30000;
}

.modal-default-button.cancel {
  background-color: #e0e0e0;
  color: #333;
  margin-right: 10px;
}

.modal-default-button.cancel:hover {
  background-color: #d0d0d0;
}

/* Modal Transitions */
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
/* Fuerza un color de texto fijo para el modal completo */
.modal-container,
.modal-container p,
.modal-container h3 {
  color: #2c3e50 !important; /* Color fijo que se verá en dark y light */
}
</style>
