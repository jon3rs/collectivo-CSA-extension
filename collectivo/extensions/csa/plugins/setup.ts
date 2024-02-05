export default defineNuxtPlugin(() => {
  const menu = useCollectivoMenus();

  menu.value.main.push({
    label: "Meine Anteile",
    icon: "i-system-uicons-cubes",
    to: "/my-shares",
    order: 100,
  });
});
