/// <reference path="../pb_data/types.d.ts" />

// Auto-creates the workout_logs and diet_logs collections on first boot.
// Safe to run multiple times — checks before creating.
onBootstrap((e) => {
  e.next();

  function ensureCollection(name, fields, rules) {
    try {
      $app.findCollectionByNameOrId(name);
      // already exists
    } catch (_) {
      const col = new Collection({
        name: name,
        type: "base",
        fields: fields,
        listRule: rules,
        viewRule: rules,
        createRule: rules,
        updateRule: rules,
        deleteRule: rules,
      });
      $app.save(col);
      console.log("[setup] Created collection: " + name);
    }
  }

  const userRule = "@request.auth.id = user_id";

  ensureCollection("workout_logs", [
    { name: "user_id",  type: "text",  required: true },
    { name: "date",     type: "text",  required: true },
    { name: "mode",     type: "text" },
    { name: "session",  type: "text" },
    { name: "sets",     type: "json" },
    { name: "done",     type: "bool" },
  ], userRule);

  ensureCollection("diet_logs", [
    { name: "user_id",  type: "text",  required: true },
    { name: "date",     type: "text",  required: true },
    { name: "items",    type: "json" },
  ], userRule);
});
