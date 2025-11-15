const initTagFilter = () => {
  const filterContainer = document.querySelector("[data-tag-filter]");
  const cards = Array.from(document.querySelectorAll(".project-card"));

  if (!cards.length) return;

  let activeTag = "all";

  const captureButtons = () =>
    Array.from(document.querySelectorAll("[data-tag][data-filter-control]"));

  const setActiveButtonState = (tag) => {
    captureButtons().forEach((btn) => {
      if (!btn.closest("[data-tag-filter]")) return;
      if (btn.dataset.tag === tag) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      }
    });
  };

  const applyFilter = (tag) => {
    cards.forEach((card) => {
      const datasetTags = (card.dataset.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const matches = tag === "all" ? true : datasetTags.includes(tag);
      card.classList.toggle("is-hidden", !matches);
      card.setAttribute("aria-hidden", String(!matches));
    });
  };

  const handleTagSelection = (tag, options = {}) => {
    if (!tag || tag === activeTag) return;
    activeTag = tag;
    setActiveButtonState(tag);
    applyFilter(tag);

    if (filterContainer && options.scrollToFilter) {
      filterContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  captureButtons().forEach((button) => {
    button.addEventListener("click", () => {
      handleTagSelection(button.dataset.tag, {
        scrollToFilter: button.dataset.scrollToFilter === "true",
      });
    });
  });

  setActiveButtonState(activeTag);
  applyFilter(activeTag);
};

const initProjectDetails = () => {
  const detailBlocks = document.querySelectorAll("[data-project-details]");
  if (!detailBlocks.length) return;

  const setHash = (projectId) => {
    if (!projectId) return;
    if (history.replaceState) {
      history.replaceState(null, "", `#${projectId}`);
    } else {
      window.location.hash = projectId;
    }
  };

  const toggleMap = new Map();

  detailBlocks.forEach((block) => {
    const toggleButton = block.querySelector(".details-toggle");
    const detailsPanel = block.querySelector(".project-card__long");
    const projectId = block.dataset.projectId;

    if (!toggleButton || !detailsPanel) return;

    const collapsedLabel = toggleButton.dataset.labelCollapsed || "More details";
    const expandedLabel = toggleButton.dataset.labelExpanded || "Hide details";

    const setState = (isExpanded, setHashFlag = false) => {
      toggleButton.setAttribute("aria-expanded", String(isExpanded));
      toggleButton.textContent = isExpanded ? expandedLabel : collapsedLabel;
      detailsPanel.hidden = !isExpanded;
      block.closest(".project-card").classList.toggle("is-expanded", isExpanded);
      if (isExpanded && setHashFlag) {
        setHash(projectId);
        block.closest(".project-card").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    setState(false);

    toggleButton.addEventListener("click", () => {
      const expanded = toggleButton.getAttribute("aria-expanded") === "true";
      setState(!expanded, !expanded);
    });

    toggleMap.set(projectId, setState);
  });

  const openFromHash = () => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const setter = toggleMap.get(hash);
    if (setter) {
      setter(true, false);
      const card = document.getElementById(hash);
      card?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  window.addEventListener("hashchange", openFromHash);
  openFromHash();
};

const setHeaderOffset = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const height = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty("--header-offset", `${height}px`);
};

const initPageInteractions = () => {
  setHeaderOffset();
  window.addEventListener("resize", setHeaderOffset);
  initTagFilter();
  initProjectDetails();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPageInteractions);
} else {
  initPageInteractions();
}
