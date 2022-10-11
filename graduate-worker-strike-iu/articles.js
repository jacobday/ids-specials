// Format article.publishDate according to AP style guide
function apShortDate(date) {
  const apMonthFormat = [
    "Jan.",
    "Feb.",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  return `${apMonthFormat[date.month - 1]} ${date.day}, ${date.year}`;
}

// Generate articles in each section
function generateSections(dataJSON) {
  dataJSON.sections.forEach((section) => {
    generateArticles(section);
  });
}

// Sorts articles in descending order (most recent first)
function sortArticles(sectionJSON) {
  return sectionJSON.articles.sort((a, b) => {
    const publishDateA = a.publishDate;
    const publishDateB = b.publishDate;

    return (
      new Date(
        publishDateB.year,
        publishDateB.month - 1,
        publishDateB.day,
        publishDateB.hour,
        publishDateB.minute
      ).getTime() -
      new Date(
        publishDateA.year,
        publishDateA.month - 1,
        publishDateA.day,
        publishDateA.hour,
        publishDateA.minute
      ).getTime()
    );
  });
}

// Append articles into given section
function generateArticles(sectionJSON) {
  const sortedArticles = sortArticles(sectionJSON);

  // Add sorted articles to section
  sortedArticles.forEach((article, index, articleArray) => {
    // Article Image Container - <div>
    const imageContainer = document.createElement("div");
    imageContainer.classList = "col-md-4";

    // --+ Article Image Anchor +--
    //  <div>
    // +  <a> </a>
    //  </div >
    const imageLink = document.createElement("a");
    imageLink.href = article.url;
    imageLink.target = "_blank";

    // --+ Article Image +--
    //  <div>
    //    <a>
    // +     <img />
    //    </a >
    //  </div >
    const articleImage = document.createElement("img");
    articleImage.src = article.featuredImage;
    articleImage.style =
      "width:100%; object-fit: cover; height: 200px; padding-bottom:10px; text-align:center;";

    imageLink.appendChild(articleImage);
    imageContainer.appendChild(imageLink);

    // Article Description Container - <div>
    const descriptionContainer = document.createElement("div");
    descriptionContainer.classList = "col-md-8";

    // --+ Article Headline Anchor +--
    //  <div>
    // +  <a> Headline </a>
    //  </div >
    const headlineLink = document.createElement("a");
    headlineLink.classList = "hed";
    headlineLink.href = article.url;
    headlineLink.target = "_blank";
    headlineLink.innerHTML = article.headline;

    descriptionContainer.appendChild(headlineLink);

    // --+ Article Publish Date +--
    //  <div>
    //    <a> Headline </a>
    // +  <p> Publish Date </p>
    //  </div >
    const publishDate = document.createElement("p");
    publishDate.classList = "pub";
    publishDate.innerHTML = `Published ${apShortDate(article.publishDate)}`;

    descriptionContainer.appendChild(publishDate);

    // --+ Article Byline +--
    //  <div>
    //    <a> Headline </a>
    //    <p> Publish Date </p>
    // +  <p> By </p>
    //  </div >
    const byline = document.createElement("p");
    byline.classList = "byline";
    byline.innerHTML = "By ";

    // --+ Article Byline Anchor +--
    //  <div>
    //    <a> Headline </a>
    //    <p> Publish Date </p>
    //    <p>
    // +    By <a> Author </a>
    //    </p >
    //  </div >
    article.bylines.by.forEach((author, index, byArray) => {
      const bylineLink = document.createElement("a");
      bylineLink.href = `https://www.idsnews.com/staff/${author.name
        .toLowerCase()
        .split(" ")
        .join("-")}`;
      bylineLink.target = "_blank";
      bylineLink.classList = "story-link";
      bylineLink.innerHTML = author.name;

      byline.appendChild(bylineLink);

      // Separate multiple authors
      if (byArray.length - 1 > 0) {
        if (byArray.length - 1 - index > 1) {
          byline.innerHTML += ", ";
        } else if (index != byArray.length - 1) {
          byline.innerHTML += " and ";
        }
      }
    });

    descriptionContainer.appendChild(byline);

    // --+ Article Excerpt +--
    //  <div>
    //    <a> Headline </a>
    //    <p> Publish Date </p>
    //    <p>
    //      By <a> Author </a>
    //    </p >
    // +  <p> Excerpt </p>
    //  </div >
    const excerpt = document.createElement("p");
    excerpt.innerHTML = article.excerpt;

    descriptionContainer.appendChild(excerpt);

    // --+ Article Card +--
    //  <div>
    // +  <div> Image Container </div>
    // +  <div> Description Container </div>
    //  </div >
    const articleCard = document.createElement("div");
    articleCard.style = "margin: 10px 0";
    articleCard.classList = "row d-flex justify-content-center story-row";

    articleCard.appendChild(imageContainer);
    articleCard.appendChild(descriptionContainer);

    // --+ Section Container +--
    //  <div data-section-id = ${sectionID}>
    // +  <div> Article Card </div>
    //  </div>
    const container = document.querySelector(
      `[data-section-id=${sectionJSON.sectionID}]`
    );

    container.appendChild(articleCard);

    // --+ Article Divider +--
    //  <div data-section-id = ${sectionID}>
    //    <div> Article Card </div>
    // +  <hr />
    //  </div>
    if (index != articleArray.length - 1) {
      const divider = document.createElement("hr");
      divider.style = "width: 80%";
      container.appendChild(divider);
    }
  });
}

// Load JSON from file
function loadJSON(fileName) {
  // make a JSON loading object
  const xobj = new XMLHttpRequest();

  // prepare to read JSON files
  xobj.overrideMimeType("application/json");

  // specify the request type
  xobj.open("GET", fileName);

  xobj.onreadystatechange = () => {
    // check if the file is loaded correctly
    if (xobj.readyState == 4 && xobj.status == 200) {
      // store the file content
      const responseText = xobj.responseText;

      // convert from string to JSON object
      const dataJSON = JSON.parse(responseText);

      // Generate articles from JSON data
      generateSections(dataJSON);
    }
  };

  xobj.send();
}

function init() {
  loadJSON("articles.json");
}

init();
