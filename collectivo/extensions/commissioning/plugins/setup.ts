export default defineNuxtPlugin(() => {
  const menu = useCollectivoMenus();

  menu.value.main.push(
    {
      label: "🦆Ernte",
      icon: "i-heroicons-shopping-bag",
      to: "/harvest",
      order: 100,
    },
    {
      label: "Kommissionierung",
      icon: "i-heroicons-scale",
      to: "/commissioning",
      order: 100,
    }
  );
});
