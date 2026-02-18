<template>
    <div
      class="flex justify-between overflow-x-visible w-full relative sm:hidden"
    >
          <div
          v-if="showNav"
          class="flex w-full justify-end mt-4"
          >
              <UButton
                  key="menu-btn"
                  class="cursor-pointer transition-all duration-100 border-2"
                  @click="toggleMobileMenu"
                  variant="link"
                  size="xl"
                  icon="lucide:menu"
                  label="Menu"
              />
          </div>
      <!-- Mobile Menu -->
      <Transition
        name="mobile-nav-slide"
        @after-leave="onAfterLeave"
      >
        <div
          v-if="showMobileMenu"
          class="absolute top-0 right-0 w-full h-screen bg-background p-4 z-50 flex flex-col pt-4 items-center"
        >
          <!-- Close Button -->
          <span class="flex w-full justify-end">
            <UButton 
              class="cursor-pointer" 
              color="accent" 
              @click="toggleMobileMenu"
              icon="fluent:dismiss-12-filled"
              variant="link"
            />
          </span>
  
          <!-- Menu Links -->
          <NuxtLink
            v-for="item in items[0]"
            @click.prevent="navigate(item.to)"
            class="cursor-pointer font-semibold w-fit hover:text-primary transform hover:scale-105 transition-all duration-100 mt-4"
          >
          <span class="flex items-center gap-4">
            <UIcon 
              :name="item.icon"
              size="30"
            />
            <h2>{{ item.label }}</h2>
          </span>
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import type { NavigationMenuItem } from '@nuxt/ui'

  
  const router = useRouter()
  const showMobileMenu = ref(false)
  let pendingRoute: string | null = null
  const showNav = ref(false)

  const props = defineProps<{
    items: NavigationMenuItem
  }>()
  
  onMounted(() => {
    showNav.value = true
  })
  
  function toggleMobileMenu() {
    showMobileMenu.value = !showMobileMenu.value
  }
  
  function navigate(path: string) {
    pendingRoute = path
    showMobileMenu.value = false
  }
  
  function navigateExternal(url: string) {
    pendingRoute = url
    showMobileMenu.value = false
  }
  
  function onAfterLeave() {
    if (!pendingRoute) return
    if (pendingRoute.startsWith('http')) {
      window.location.href = pendingRoute
    } else {
      router.push(pendingRoute)
    }
    pendingRoute = null
  }
  </script>
  
  <style>
  .mobile-nav-slide-enter-active,
  .mobile-nav-slide-leave-active {
    transition: transform 0.5s ease, opacity 0.3s ease;
  }
  
  .mobile-nav-slide-enter-from,
  .mobile-nav-slide-leave-to {
    transform: translateX(60%);
    opacity: 0;
  }
  
  .mobile-nav-slide-enter-to,
  .mobile-nav-slide-leave-from {
    transform: translateX(0);
    opacity: 1;
  }
  </style>
  