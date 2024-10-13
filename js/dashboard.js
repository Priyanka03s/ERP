function showContent(sectionId) {
  const sections = document.querySelectorAll(".content");
  sections.forEach((section) => {
    section.style.display = "none";
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = "block";
  }
}
