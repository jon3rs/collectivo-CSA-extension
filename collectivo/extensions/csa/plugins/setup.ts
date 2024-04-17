export default defineNuxtPlugin(() => {
  const menu = useCollectivoMenus();

  menu.value.main.push(
    {
      label: "Meine Anteile",
      icon: "i-heroicons-shopping-bag",
      to: "/my-shares",
      order: 100,
    },
    {
      label: "Lieferzyklen",
      icon: "i-heroicons-arrow-path",
      to: "/delivery-cycles",
      order: 100,
    },
  );
});
