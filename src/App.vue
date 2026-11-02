<script setup lang="ts">
// Example from https://vueuse.org/shared/refManualReset/
import { refManualReset } from '@vueuse/core'

const message = refManualReset('default message')

message.value = 'message has set'

message.reset() // false positive: vue/no-ref-as-operand

console.log(message.value) // 'default message'
</script>
