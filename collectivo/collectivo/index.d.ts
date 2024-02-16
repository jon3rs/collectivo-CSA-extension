import { DirectusUser, DirectusRole } from "@directus/sdk";

declare global {
  // Database schema
  interface CollectivoSchema {
    collectivo_extensions: CollectivoExtension[];
    collectivo_tiles: CollectivoTile[];
    collectivo_tags: CollectivoTag[];
    directus_users: CollectivoUser[];
  }

  interface DataWrapper<T> {
    data: T | null | undefined;
    error: Error | null | undefined | unknown;
    loading: boolean;
    saving: boolean;
  }

  interface CollectivoUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: DirectusRole;
    [key: string]: string | undefined;
  }

  interface CollectivoTag {
    id: number;
    tags_name: string;
    tags_users: CollectivoUser[] | number[];
  }

  interface CollectivoTileButton {
    id: number;
    tiles_label: string;
    tiles_path: string;
    tiles_is_external: boolean;
  }

  interface CollectivoTile {
    id: number;
    sort: number;
    tiles_name: string;
    tiles_content: string;
    tiles_status: "published" | "draft" | "archived";
    tiles_buttons: CollectivoTileButton[];
    tiles_color: string;
  }

  interface CollectivoExtension {
    id: number;
    extensions_name: string;
    extensions_version: string;
    extensions_schema_version: number;
    extensions_schema_is_latest: boolean;
  }

  interface CollectivoSettings {
    id: number;
    collectivo_project_name: string;
    collectivo_project_description: string;
    collectivo_members_role: string;
    collectivo_admin_role: string;
  }

  // Layout
  interface CollectivoMenus {
    main: CollectivoMenuItem[];
    public: CollectivoMenuItem[];
    profile: CollectivoMenuItem[];
  }

  interface CollectivoMenuItem {
    label: string;
    icon?: string;
    to?: string;
    click?: () => void;
    external?: boolean; // Defaults to false
    target?: string; // Default "_self"
    order?: number; // Default 100
    hideOnMobile?: boolean; // Default false
    filter?: (item: CollectivoMenuItem) => Promise<boolean> | boolean;
  }

  // Forms
  interface CollectivoForm {
    title: string;
    fields: CollectivoFormField[];
    public?: boolean;
    submitMode?: "postNuxt" | (() => void);
    submitPath?: string;
    submitLabel?: string;
    successTitle?: string;
    successText?: string;
    successIcon?: string;
    beforeSubmit?: (data: any) => any;
  }

  type CollectivoFormField = CollectivoFormLayout | CollectivoFormInput;

  interface CollectivoFormFieldBase {
    order: number;
    width?: "full" | "half" | "xl" | "lg" | "md" | "sm" | "xs";
    conditions?: FormCondition[];
    _visible?: Ref<boolean>;
  }

  // These should not have a "key" property, because "key" is used to identify inputs
  type CollectivoFormLayout = CollectivoFormFieldBase &
    (
      | {
          type: "description";
          label?: string;
          description: string;
          boxed?: boolean;
        }
      | {
          type: "section";
          title?: string;
          icon?: string;
          description?: string;
        }
      | {
          type: "clear";
        }
      | {
          type: "custom-layout";
          component: any;
        }
    );

  type CollectivoFormInput = {
    type: string;
    key: string;
    label?: string;
    default?: any;
    required?: boolean;
    disabled?: boolean;
    validators?: FormValidator[];
    description?: string;
  } & CollectivoFormFieldBase &
    CollectivoFormInputType;

  type CollectivoFormInputType =
    | {
        type: "select";
        choices?: CollectivoFormInputChoice[];
        multiple?: boolean;
        expand?: boolean;
      }
    | {
        type: "text" | "number" | "email" | "password" | "textarea";
        placeholder?: string;
        icon?: string;
      }
    | {
        type: "date";
        datepicker?: boolean;
        birthdate?: boolean;
      }
    | {
        type: "checkbox";
        content?: string;
      }
    | {
        type: "custom-input";
        component: any;
      };

  interface CollectivoFormInputChoice {
    value: string;
    label: string;
  }

  interface FormCondition {
    key: string;
    value: string | number | boolean;
    // TODO: Add operator?: "==" | "!=" | ">" | "<" | ">=" | "<=";
  }

  type FormValidator =
    | {
        type: "min" | "max" | "email" | "url" | "regex";
        value?: string | number | RegExp;
        message?: string;
      }
    | {
        type: "test" | "transform";
        value: string;
        message?: string;
      };
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
