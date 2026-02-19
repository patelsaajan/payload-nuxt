<template>
    <div class="bg-background text-text min-h-screen flex flex-col">
        <header>
            <div class="text-2xl flex justify-center w-full mt-4">
                <h3>Preview</h3>
            </div>
        </header>
        <main class="flex-1">
            <slot />
        </main>
        <LayoutFooter />
    </div>
</template>