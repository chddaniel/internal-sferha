import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { SearchPerformancePage } from "@/client/features/search-performance/SearchPerformancePage";
import { searchPerformanceSearchSchema } from "@/types/schemas/search-performance";

const DEFAULT_SEARCH = {
  dateRange: "last_28_days",
  tab: "striking",
} as const;

export const Route = createFileRoute(
  "/_project/p/$projectId/search-performance",
)({
  validateSearch: searchPerformanceSearchSchema,
  search: { middlewares: [stripSearchParams(DEFAULT_SEARCH)] },
  component: SearchPerformanceRoute,
});

function SearchPerformanceRoute() {
  const { projectId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  return (
    <SearchPerformancePage
      projectId={projectId}
      search={search}
      onSearchChange={(updates) => {
        void navigate({
          search: (previous) => ({ ...previous, ...updates }),
          replace: true,
        });
      }}
    />
  );
}
