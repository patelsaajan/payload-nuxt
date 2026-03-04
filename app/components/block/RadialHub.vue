<template>
    <div
        v-if="iconCount"
        ref="wrapperRef"
        class="min-h-100vh] flex items-center"
    >
        <!-- Desktop Layout (lg+) - Radial wheel -->
        <div class="hidden lg:grid grid-cols-5 items-center gap-4 w-full">
            <div class="relative circle-wrapper col-span-2">
                <!-- Rotating container -->
                <div
                    ref="circleParentRef"
                    class="circle-parent duration-300"
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
                    {{ title }}
                </h2>
            </div>
            <div class="grid grid-cols-3 col-span-3">
                <div class="col-span-2 flex flex-col gap-4 max-w-3xl relative">
                    <!-- Progress counter -->
                    <span class="text-lg font-semibold">
                        {{ activeIndex + 1 }} / {{ iconCount }}
                    </span>
                    <Transition name="fade" mode="out-in">
                        <div :key="activeIndex" class="flex flex-col gap-4">
                            <h2>{{ activeItem?.title }}</h2>
                            <span class="text-3xl">
                                {{ activeItem?.description }}
                            </span>
                        </div>
                    </Transition>
                </div>
                <div class="flex flex-col gap-4 justify-center items-center">
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

        <!-- Medium Layout (md) - Card-based without wheel -->
        <div class="hidden md:flex lg:hidden flex-col gap-8 w-full px-4">
            <div class="text-center">
                <h2 class="mb-2">{{ title }}</h2>
                <span class="text-base text-muted-foreground">
                    {{ activeIndex + 1 }} / {{ iconCount }}
                </span>
            </div>

            <div class="flex items-center gap-6">
                <!-- Icon display -->
                <div class="flex-shrink-0">
                    <Transition name="fade" mode="out-in">
                        <div
                            :key="activeIndex"
                            class="w-32 h-32 rounded-full bg-primary flex items-center justify-center"
                        >
                            <UIcon
                                :name="activeItem?.icon || ''"
                                size="80"
                                class="text-primary-foreground"
                            />
                        </div>
                    </Transition>
                </div>

                <!-- Content -->
                <div class="flex-1">
                    <Transition name="fade" mode="out-in">
                        <div :key="activeIndex" class="flex flex-col gap-2">
                            <h3>{{ activeItem?.title }}</h3>
                            <p class="text-lg text-muted-foreground">
                                {{ activeItem?.description }}
                            </p>
                        </div>
                    </Transition>
                </div>

                <!-- Navigation -->
                <div class="flex flex-col gap-2">
                    <UButton
                        variant="outline"
                        size="lg"
                        @click="onClick()"
                    >
                        <UIcon name="lucide:chevron-up" size="24" />
                    </UButton>
                    <UButton
                        variant="outline"
                        size="lg"
                        @click="onClick('down')"
                    >
                        <UIcon name="lucide:chevron-down" size="24" />
                    </UButton>
                </div>
            </div>

            <!-- Icon dots indicator -->
            <div class="flex justify-center gap-2">
                <button
                    v-for="(item, index) in items"
                    :key="index"
                    class="w-3 h-3 rounded-full transition-colors duration-300"
                    :class="index === activeIndex ? 'bg-primary' : 'bg-muted'"
                    @click="setActiveIndex(index)"
                />
            </div>
        </div>

        <!-- Mobile Layout (sm) - Simplified stack -->
        <div class="flex md:hidden flex-col gap-6 w-full px-4">
            <div class="text-center">
                <h2 class="mb-2">{{ title }}</h2>
                <span class="text-sm text-muted-foreground">
                    {{ activeIndex + 1 }} / {{ iconCount }}
                </span>
            </div>

            <div class="flex flex-col items-center gap-4">
                <Transition name="fade" mode="out-in">
                    <div
                        :key="activeIndex"
                        class="w-24 h-24 rounded-full bg-primary flex items-center justify-center"
                    >
                        <UIcon
                            :name="activeItem?.icon || ''"
                            size="56"
                            class="text-primary-foreground"
                        />
                    </div>
                </Transition>

                <Transition name="fade" mode="out-in">
                    <div :key="activeIndex" class="text-center">
                        <h3 class="mb-2">{{ activeItem?.title }}</h3>
                        <p class="text-muted-foreground">
                            {{ activeItem?.description }}
                        </p>
                    </div>
                </Transition>

                <!-- Navigation row -->
                <div class="flex items-center gap-4">
                    <UButton
                        variant="outline"
                        @click="onClick()"
                    >
                        <UIcon name="lucide:chevron-left" size="20" />
                    </UButton>

                    <!-- Dots -->
                    <div class="flex gap-2">
                        <button
                            v-for="(item, index) in items"
                            :key="index"
                            class="w-2 h-2 rounded-full transition-colors duration-300"
                            :class="index === activeIndex ? 'bg-primary' : 'bg-muted'"
                            @click="setActiveIndex(index)"
                        />
                    </div>

                    <UButton
                        variant="outline"
                        @click="onClick('down')"
                    >
                        <UIcon name="lucide:chevron-right" size="20" />
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const circleParentRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
let rotation = 0
const activeIndex = ref(0)
let isScrolling = false
let isLocked = false
let isReady = false
let hasReachedEnd = false
let hasReachedStart = false

const props = defineProps<{
  id: string
  blockType: string
  blockName?: string | null
  title: string
  items: {
    icon: string
    title: string
    description: string
  }[]
}>()

const iconCount = computed(() => props.items.length)
const degSpacing = computed(() => 360 / props.items.length)
const activeItem = computed(() => props.items[activeIndex.value])

// Rotate wheel with clamp (no infinite loop)
const rotate = (direction: 'up' | 'down') => {
  if (!circleParentRef.value) return

  if (direction === 'down') {
    if (activeIndex.value < iconCount.value - 1) {
      rotation -= degSpacing.value
      activeIndex.value++
    }
  } else {
    if (activeIndex.value > 0) {
      rotation += degSpacing.value
      activeIndex.value--
    }
  }

  circleParentRef.value.style.transform = `rotate(${rotation}deg)`
}

// Buttons
const onClick = (direction?: string) => {
  rotate(direction === 'down' ? 'down' : 'up')
}

// Dots click
const setActiveIndex = (index: number) => {
  if (!circleParentRef.value) return

  const diff = index - activeIndex.value
  rotation += diff * degSpacing.value * -1
  activeIndex.value = index
  circleParentRef.value.style.transform = `rotate(${rotation}deg)`
}

// Snap element to viewport center
const snapToCenter = () => {
  if (!wrapperRef.value) return

  const rect = wrapperRef.value.getBoundingClientRect()
  const elementCenter = rect.top + rect.height / 2
  const viewportCenter = window.innerHeight / 2
  const scrollOffset = elementCenter - viewportCenter

  window.scrollBy({
    top: scrollOffset,
    behavior: 'smooth'
  })
}

// Wheel scroll handler
const onWheel = (event: WheelEvent) => {
  if (window.innerWidth < 1024) return

  const scrollingDown = event.deltaY > 0
  const scrollingUp = event.deltaY < 0

  const rect = wrapperRef.value?.getBoundingClientRect()
  if (!rect) return

  const vh = window.innerHeight
  const enteringFromTop = scrollingDown && rect.top < vh * 0.7 && rect.top > 0
  const enteringFromBottom = scrollingUp && rect.bottom > vh * 0.3 && rect.bottom < vh

  // Engage lock on entering
  if (!isLocked && (enteringFromTop || enteringFromBottom)) {
    event.preventDefault()
    snapToCenter()
    setTimeout(() => {
      isLocked = true
      hasReachedEnd = false
      hasReachedStart = false
      // Delay isReady to prevent immediate rotation from scroll momentum
      setTimeout(() => {
        isReady = true
      }, 400)
    }, 600)
    return
  }

  // Not locked or not ready yet - allow normal scroll
  if (!isLocked || !isReady) return

  // Check if at boundary - require two scrolls to exit
  if (scrollingDown && activeIndex.value === iconCount.value - 1) {
    if (hasReachedEnd) {
      // Second scroll at end - unlock and allow normal scroll
      isLocked = false
      isReady = false
      return
    }
    // First scroll at end - mark but stay locked
    event.preventDefault()
    hasReachedEnd = true
    return
  }
  if (scrollingUp && activeIndex.value === 0) {
    if (hasReachedStart) {
      // Second scroll at start - unlock and allow normal scroll
      isLocked = false
      isReady = false
      return
    }
    // First scroll at start - mark but stay locked
    event.preventDefault()
    hasReachedStart = true
    return
  }

  // Reset boundary flags when moving away from boundaries
  if (scrollingDown) {
    hasReachedStart = false
  } else if (scrollingUp) {
    hasReachedEnd = false
  }

  // Still rotating through items - prevent scroll and rotate
  event.preventDefault()
  if (isScrolling) return
  isScrolling = true

  if (scrollingDown) {
    rotate('down')
  } else if (scrollingUp) {
    rotate('up')
  }

  setTimeout(() => {
    isScrolling = false
  }, 1000) // smoother UX
}

onMounted(() => {
  window.addEventListener('wheel', onWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('wheel', onWheel)
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