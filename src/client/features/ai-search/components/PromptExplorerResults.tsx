import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  XCircle,
} from "lucide-react";
import {
  extractAnswerBody,
  MarkdownAnswer,
} from "@/client/features/ai-search/components/MarkdownAnswer";
import { copyTextToClipboard } from "@/client/lib/clipboard";
import {
  formatModelLabel,
  getModelAccent,
} from "@/client/features/ai-search/platformLabels";
import { formatUrlForDisplay } from "@/client/components/table/url";
import { toast } from "sonner";
import type {
  PromptExplorerCitation,
  PromptExplorerModelResult,
  PromptExplorerResult,
} from "@/types/schemas/ai-search";

type Props = {
  result: PromptExplorerResult;
};

export function PromptExplorerResults({ result }: Props) {
  const handleCopyComparison = async () => {
    try {
      await copyTextToClipboard(formatPromptExplorerComparison(result));
      toast.success("Prompt comparison copied");
    } catch {
      toast.error("Could not copy comparison");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-outline btn-sm gap-2"
          onClick={() => void handleCopyComparison()}
          aria-label="Copy Prompt Explorer comparison"
        >
          <Copy className="size-3.5" />
          Copy comparison
        </button>
      </div>
      {result.results.map((modelResult) => (
        <ModelResultCard
          key={modelResult.model}
          modelResult={modelResult}
          highlightBrand={result.highlightBrand}
        />
      ))}
    </div>
  );
}

export function formatPromptExplorerComparison(
  result: PromptExplorerResult,
): string {
  const prompt = result.prompt
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join("\n");
  const sections = [
    "# Prompt Explorer comparison",
    `**Generated:** ${result.fetchedAt}`,
    result.highlightBrand
      ? `**Brand highlighted:** ${result.highlightBrand}`
      : null,
    `## Prompt\n\n${prompt}`,
    ...result.results.map((modelResult) => {
      const heading = `## ${formatModelLabel(modelResult.model)}`;

      if (modelResult.status === "error") {
        return `${heading} (error)\n\n${modelResult.message}`;
      }

      const answer = extractAnswerBody(modelResult.text);
      const citedSources = modelResult.citations.length
        ? `\n\n### Cited sources\n\n${modelResult.citations
            .map(
              (citation) => `- ${citation.title || "Source"}: ${citation.url}`,
            )
            .join("\n")}`
        : "";

      return `${heading}\n\n${answer || "_Model returned an empty response._"}${citedSources}`;
    }),
  ];

  return sections
    .filter((section): section is string => section !== null)
    .join("\n\n");
}

function ModelResultCard({
  modelResult,
  highlightBrand,
}: {
  modelResult: PromptExplorerModelResult;
  highlightBrand: string | null;
}) {
  const accent = getModelAccent(modelResult.model);

  if (modelResult.status === "error") {
    return (
      <article
        className={`overflow-hidden rounded-r-lg border border-base-300 border-l-4 ${accent.border} bg-base-100`}
      >
        <ModelHeader
          model={modelResult.model}
          modelName={null}
          tokens={null}
          webSearch={false}
          brandMentioned={null}
          highlightBrand={null}
          status="error"
        />
        <div className="flex items-start gap-2 px-5 py-4 text-sm text-error">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{modelResult.message}</span>
        </div>
      </article>
    );
  }

  const answerBody = extractAnswerBody(modelResult.text);
  const handleCopyResponse = async () => {
    if (!answerBody) return;

    try {
      await copyTextToClipboard(answerBody);
      toast.success(`${formatModelLabel(modelResult.model)} response copied`);
    } catch {
      toast.error("Could not copy response");
    }
  };

  return (
    <article
      className={`overflow-hidden rounded-r-lg border border-base-300 border-l-4 ${accent.border} bg-base-100`}
    >
      <ModelHeader
        model={modelResult.model}
        modelName={modelResult.modelName}
        tokens={modelResult.outputTokens}
        webSearch={modelResult.webSearch}
        brandMentioned={modelResult.brandMentioned}
        highlightBrand={highlightBrand}
        status="success"
        onCopy={() => void handleCopyResponse()}
        copyDisabled={!answerBody}
      />

      <div className="px-5 py-5">
        <MarkdownAnswer text={modelResult.text} />
      </div>

      {modelResult.citations.length > 0 ? (
        <CitationsList
          citations={modelResult.citations}
          highlightBrand={highlightBrand}
        />
      ) : null}

      {modelResult.fanOutQueries.length > 0 ? (
        <div className="border-t border-base-200 px-5 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-base-content/50">
            Related queries the model considered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {modelResult.fanOutQueries.map((query, index) => (
              <span
                key={`${query}-${index}`}
                className="rounded-full border border-base-300 px-2.5 py-0.5 text-xs text-base-content/70"
              >
                {query}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function CitationsList({
  citations,
  highlightBrand,
}: {
  citations: PromptExplorerCitation[];
  highlightBrand: string | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? citations : citations.slice(0, 3);
  const remaining = citations.length - visible.length;

  return (
    <div className="border-t border-base-200 bg-base-200/30 px-5 py-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-base-content/50">
        Cited sources ({citations.length})
      </p>
      <ul className="space-y-1.5">
        {visible.map((citation, index) => (
          <li
            key={`${citation.url}-${index}`}
            className="flex items-start gap-2 text-sm"
          >
            <span className="mt-1 size-1 shrink-0 rounded-full bg-base-content/30" />
            <a
              href={citation.url}
              target="_blank"
              rel="noreferrer"
              className={`link inline-flex items-start gap-1 ${
                citation.matchedBrand ? "link-primary font-medium" : ""
              }`}
            >
              <span className="break-all">
                {citation.title || formatUrlForDisplay(citation.url)}
              </span>
              <ExternalLink className="mt-1 size-3 shrink-0" />
            </a>
            {citation.matchedBrand && highlightBrand ? (
              <span className="badge badge-primary badge-xs">
                {highlightBrand}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      {citations.length > 3 ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1.5 text-xs text-base-content/50 hover:text-base-content"
        >
          {expanded ? "Show less" : `+${remaining} more`}
        </button>
      ) : null}
    </div>
  );
}

function ModelHeader({
  model,
  modelName,
  tokens,
  webSearch,
  brandMentioned,
  highlightBrand,
  status,
  onCopy,
  copyDisabled = false,
}: {
  model: PromptExplorerModelResult["model"];
  modelName: string | null;
  tokens: number | null;
  webSearch: boolean;
  brandMentioned: boolean | null;
  highlightBrand: string | null;
  status: "success" | "error";
  onCopy?: () => void;
  copyDisabled?: boolean;
}) {
  const accent = getModelAccent(model);
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 bg-base-200/40 px-5 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`size-2 rounded-full ${accent.dot}`} />
        <h3 className="text-sm font-semibold">{formatModelLabel(model)}</h3>
        {modelName ? (
          <code className="text-xs text-base-content/50">{modelName}</code>
        ) : null}
        {status === "error" ? (
          <span className="badge badge-error badge-sm">Error</span>
        ) : null}
        <BrandMentionBadge
          mentioned={brandMentioned}
          highlightBrand={highlightBrand}
        />
        {webSearch ? (
          <span className="inline-flex items-center gap-1 text-xs text-base-content/60">
            <Globe className="size-3" />
            web search
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {tokens != null ? (
          <span className="text-xs tabular-nums text-base-content/50">
            {tokens.toLocaleString()} tokens
          </span>
        ) : null}
        {onCopy ? (
          <button
            type="button"
            className="btn btn-ghost btn-xs gap-1"
            onClick={onCopy}
            disabled={copyDisabled}
            aria-label={`Copy ${formatModelLabel(model)} response`}
          >
            <Copy className="size-3.5" />
            Copy response
          </button>
        ) : null}
      </div>
    </header>
  );
}

function BrandMentionBadge({
  mentioned,
  highlightBrand,
}: {
  mentioned: boolean | null;
  highlightBrand: string | null;
}) {
  if (mentioned == null || !highlightBrand) return null;
  if (mentioned) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
        <CheckCircle2 className="size-3" />
        {highlightBrand}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-base-200 px-2 py-0.5 text-xs text-base-content/60">
      <XCircle className="size-3" />
      no {highlightBrand}
    </span>
  );
}
