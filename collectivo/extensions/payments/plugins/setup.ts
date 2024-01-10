export default defineNuxtPlugin({
  name: "memberships-setup",
  async setup() {
    const menu = useCollectivoMenus();
    const user = useCollectivoUser();

    const publicItems: CollectivoMenuItem[] = [];

    menu.value.public.push(...publicItems);

    const profileInputs: CollectivoFormField[] = [
      {
        type: "section",
        order: 700,
        title: "Payment details",
      },
      {
        label: "Payment type",
        key: "payments_type",
        type: "select",
        order: 710,
        choices: [
          {
            value: "sepa",
            label: "SEPA Direct Debit",
          },
          {
            value: "transfer",
            label: "Transfer",
          },
        ],
      },
      {
        label: "Bank account IBAN",
        key: "payments_account_iban",
        type: "text",
        order: 720,
      },
      {
        label: "Bank account owner",
        key: "payments_account_owner",
        type: "text",
        order: 730,
      },
    ];

    user.value.fields.push(...profileInputs);
  },
});
