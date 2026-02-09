<template>
    <div
        class="h-[calc(100vh-250px)] flex items-center justify-center px-4"
        :style="{ backgroundColor: 'var(--color-background, var(--theme-background))' }"
    >
        <div
            class="text-center max-w-md w-full p-8 md:p-12 rounded-2xl shadow-lg border"
            :style="{
                backgroundColor: 'var(--color-secondary, var(--theme-secondary))',
                borderColor: 'var(--color-primary, var(--theme-primary))',
                borderWidth: '2px',
            }"
        >
            <h1
                class="text-[5rem] md:text-[7rem] font-bold leading-none"
                :style="{ color: 'var(--color-primary, var(--theme-primary))' }"
            >
                404
            </h1>
            <h2
                class="mt-4"
                :style="{ color: 'var(--color-text, var(--theme-text))' }"
            >
                Page Not Found
            </h2>
            <p
                class="mt-2 opacity-80"
                :style="{ color: 'var(--color-text, var(--theme-text))' }"
            >
                The page you're looking for doesn't exist.
            </p>
            <UButton
                to="/"
                color="primary"
                variant="solid"
                label="Back to Home"
                class="mt-6"
            />
        </div>
    </div>
</template>
