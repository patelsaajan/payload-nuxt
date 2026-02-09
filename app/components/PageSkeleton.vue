<template>
    <div class="container mx-auto my-12">
        <div class="animate-pulse">
            <!-- Hero skeleton -->
            <div class="w-full h-[300px] md:h-[400px] bg-gray-200 rounded-lg" />

            <!-- Content sections skeleton -->
            <div class="mt-12 flex flex-col gap-20 max-w-2xl mx-auto px-5">
                <!-- Section 1 -->
                <div class="space-y-4">
                    <USkeleton class="h-8 w-3/4" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-2/3" />
                </div>
                <!-- Section 2 -->
                <div class="flex space-x-4">                    
                    <USkeleton class="h-40 w-1/2" />
                    <USkeleton class="h-40 w-1/2" />
                </div>

                <!-- Section 3 -->
                <div class="space-y-4">
                    <USkeleton class="h-8 w-1/2" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-4 w-5/6" />
                </div>

                <!-- Section 4 -->
                 <div class="flex space-x-4">                    
                    <USkeleton class="h-40 w-1/2" />
                    <USkeleton class="h-40 w-1/2" />
                </div>
            </div>
        </div>
    </div>
</template>
