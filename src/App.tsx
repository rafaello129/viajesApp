
import { AppRouter } from "./infrastructure/routing/AppRouter";
import { CustomAlert } from "./presentation/components/ui";
import { useUiStore } from "./presentation/store/ui/useUiStore";

export const App = () => {
  const { error, success, setError, setSuccess } = useUiStore();
  return (
    <>
      {/* Alerts */}
      {error && (
        <CustomAlert message={error} type="error" onClose={() => setError(null)} />
      )}
      {success && (
        <CustomAlert message={success} type="success" onClose={() => setSuccess(null)} />
      )}

      <AppRouter />
    </>
  );
};
