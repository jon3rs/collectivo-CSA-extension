export default defineNuxtPlugin(() => {
    const menu = useCollectivoMenus();
  
    menu.value.main.push(
      {
        label: "Kommissionierung",
        icon: "i-heroicons-shopping-bag",
        to: "/commissioning",
        order: 100,
      },
    );
  });
  