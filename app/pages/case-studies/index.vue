<template>
  <div class="container mx-auto py-12 px-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Case Studies</h1>
    </div>

    <!-- Grid: 1 col mobile, 2 cols sm, 3 cols md, 4 cols lg -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="caseStudy in dummyCaseStudies"
        :key="caseStudy.id"
        class="overflow-hidden cursor-pointer transition-transform hover:scale-105 flex flex-col"
        style="border-radius: var(--border-radius); background-color: var(--color-background)"
      >
        <!-- Card Image -->
        <div
          class="w-full h-48 overflow-hidden"
          style="border-radius: var(--border-radius) var(--border-radius) 0 0"
        >
          <img
            :src="caseStudy.image"
            :alt="caseStudy.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Card Content -->
        <div class="flex flex-col flex-grow p-6">
          <!-- Heading and Excerpt -->
          <div class="flex-grow">
            <h3
              class="text-xl font-semibold mb-3"
              style="color: var(--color-primary)"
            >
              {{ caseStudy.title }}
            </h3>

            <p
              class="text-sm line-clamp-3"
              style="color: var(--color-text)"
            >
              {{ caseStudy.excerpt }}
            </p>
          </div>

          <!-- Read More Link - Always at bottom right -->
          <div class="mt-4 flex justify-end">
            <span
              class="text-sm font-medium inline-flex items-center gap-1"
              style="color: var(--color-accent)"
            >
              Read More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dummy case studies data
const dummyCaseStudies = [
  {
    id: 1,
    title: 'E-commerce Platform Redesign',
    excerpt: 'How we increased conversion rates by 150% through a complete UX overhaul and modern design system implementation.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Healthcare Mobile App',
    excerpt: 'Building a HIPAA-compliant telehealth platform that connects patients with doctors seamlessly.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'SaaS Dashboard Optimization',
    excerpt: 'Streamlining complex data visualization for enterprise clients, reducing load times by 60%.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Financial Services Portal',
    excerpt: 'Creating a secure, user-friendly banking platform with real-time transaction processing.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=300&fit=crop',
  },
  {
    id: 5,
    title: 'Education Platform Launch',
    excerpt: 'Developed an interactive learning management system serving over 50,000 students worldwide.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&h=300&fit=crop',
  },
  {
    id: 6,
    title: 'Restaurant Booking System',
    excerpt: 'Modern reservation platform that increased bookings by 200% for a multi-location restaurant chain.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop',
  },
  {
    id: 7,
    title: 'Real Estate Marketplace',
    excerpt: 'End-to-end property listing platform with virtual tours and AI-powered recommendations.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop',
  },
  {
    id: 8,
    title: 'Fitness Tracking App',
    excerpt: 'Social fitness platform with gamification features that boosted user engagement by 300%.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=300&fit=crop',
  },
]
</script>

<style scoped>
/* Add box shadow for cards */
.grid > div {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grid > div:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>