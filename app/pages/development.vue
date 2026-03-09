<template>
    <div class="h-[calc(100vh-80px)] mx-16">
        <div class="grid grid-cols-12 gap-6 w-full h-full">
            <div class="flex flex-col size-full text-primary-text justify-between bg-primary/70 col-span-4 rounded-[calc(var(--border-radius)*4)] p-20 shadow-lg shadow-black/40">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-0">
                        <h2 class="font-bold">
                            Dr Deesha
                        </h2>
                        <p class="text-sm">
                            MChD Dental Surgery and BSc Oral Science
                        </p>
                    </div>
                    <p class="text-2xl">
                        SmartSmiles · Ystrad Mynach, South Wales
                    </p>
                </div>
                <div class="flex flex-col gap-4">
                    <h1>
                    Helping you feel great about your smile
                    </h1>
                    <UButton
                        class="w-fit"
                        size="xl"
                        color="accent"
                    >
                        Book Appointment
                    </UButton>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4 items-center">
                            <UIcon 
                                name="lucide:check"
                                size="20"
                            />
                            <span>NHS & Private patients welcome</span>
                        </div>
                        <div class="flex gap-4 items-center">
                            <UIcon 
                                name="lucide:check"
                                size="20"
                            />
                            <span>Gentle, anxiety-friendly care</span>
                        </div>
                        <div class="flex gap-4 items-center">
                            <UIcon 
                                name="lucide:check"
                                size="20"
                            />
                            <span>Advanced cosmetic training</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-primary col-span-8 rounded-[calc(var(--border-radius)*4)] h-full overflow-hidden shadow-lg shadow-black/40">
                <NuxtImg
                src="/images/dr-deesha-hero.jpg"
                class="object-cover size-full"
                />
            </div>
        </div>
    </div>
</template>