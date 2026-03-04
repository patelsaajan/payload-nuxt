<template>

    <div
        v-if="iconCount"
        class="grid grid-cols-5 items-center gap-4"
    >
        <div class="relative circle-wrapper col-span-2">
            <!-- Rotating container -->
            <div
                ref="circleParentRef"
                class="circle-parent opacity-0 lg:opacity-100 duration-300"
                :style="{'--degSpacing': degSpacing}"
            >
                <!-- SVG for circle outline and connecting lines -->
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
                    <!-- Outer circle outline (outside the icons) -->
                    <circle
                        cx="500"
                        cy="500"
                        r="400"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="6"
                        class="text-primary/75"
                    />

                    <!-- Lines from center to icons -->
                    <g v-for="index in iconCount" :key="'line-' + index">
                        <line
                            :x1="500 + 120 * Math.cos((index - 1) * (2 * Math.PI / iconCount))"
                            :y1="500 + 120 * Math.sin((index - 1) * (2 * Math.PI / iconCount))"
                            :x2="500 + 280 * Math.cos((index - 1) * (2 * Math.PI / iconCount))"
                            :y2="500 + 280 * Math.sin((index - 1) * (2 * Math.PI / iconCount))"
                            stroke="currentColor"
                            stroke-width="3"
                            class="text-primary/75"
                        />
                    </g>
                </svg>

                <div
                    v-for="(item, index) in items"
                    :key="index"
                    class="flex flex-col items-center circle-item bg-background"
                    :style="{ '--i': index }"
                >
                    <UIcon
                        class="circle-icon opacity-80 scale-60 duration-300"
                        :class="index === activeIndex ? 'bg-primary text-primary-foreground scale-100 opacity-100' : ''"
                        :name='item.icon'
                        size="200"
                    />
                </div>
            </div>

            <!-- Static title (doesn't rotate) -->
            <h2 class="circle-title text-wrap w-[250px] text-center">
                {{title}}
            </h2>
        </div>
        <div class="grid grid-cols-3 col-span-3">
            <div class="col-span-2 flex flex-col gap-4 max-w-3xl relative">
                <Transition name="fade" mode="out-in">
                    <div :key="activeIndex" class="flex flex-col gap-4">
                        <h2>{{ activeItem?.title }}</h2>
                        <span class="text-3xl">
                            {{ activeItem?.description }}
                        </span>
                    </div>
                </Transition>
            </div>
            <div
                class="flex flex-col gap-4 justify-center items-center"
            >
            <UButton
                class="cursor-pointer hover:bg-accent rounded-[var(--border-radius)]"
                size="lg"
                @click="onClick()"
            >
                <UIcon
                    name="lucide:arrow-up"
                    size="40"
                />
            </UButton>
            <UButton
                class="cursor-pointer hover:bg-accent rounded-[var(--border-radius)]"
                size="lg"
                @click="onClick('down')"
            >
                <UIcon
                    name="lucide:arrow-down"
                    size="40"
                />
            </UButton>
            </div>
        </div> 
    </div>
</template>

<script setup lang="ts">

const circleParentRef = ref<HTMLBodyElement | null>(null)
let rotation = 0;
const activeIndex = ref(0);

const props = defineProps<{
  id: string;
  blockType: string;
  blockName?: string | null;
  title: string;
  items: {
    icon: string;
    title: string;
    description: string;
  }[];
}>();

const { iconCount, degSpacing } = computed(() => ({
  iconCount: props.items.length,
  degSpacing: 360 / props.items.length
})).value

const activeItem = computed(() => props.items[activeIndex.value])

const onClick = ((direction?: string) => {
    if (direction === 'down') {
        rotation += degSpacing
        activeIndex.value = (activeIndex.value - 1 + iconCount) % iconCount
    } else {
        rotation -= degSpacing
        activeIndex.value = (activeIndex.value + 1 + iconCount) % iconCount
    }
    if (circleParentRef.value) {
        circleParentRef.value.style.transform = `rotate(${rotation}deg)`
    }
})

</script>

<style>
.circle-wrapper {
    position: relative;
    width: 1000px;
    height: 1000px;
    transform: translateX(-30%);
}

.circle-parent {
    position: absolute;
    inset: 0;
    transform-origin: center;
    pointer-events: none;
}

.circle-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    padding: 1rem;
}

.circle-item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform:
        translate(-50%, -50%)
        rotate(calc(var(--i) * var(--degSpacing) * 1deg))
        translate(400px);
    z-index: 10;
    width: 200px;
    height: 200px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>