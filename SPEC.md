Below is a script I currently use in wordpress. I want to convert this into a plugin that does the same thing, but with a UI to select pictures

Features

1. Settings page where you can select which pictures from media you want to include, and their order.
2. You can also upload media from here.
3. You can set the backgroundPositionY percentage manually and preview what this will look like in a preview window
4. Create files for a plugin, plus a script to bundle this into a zip or whatever is needed to run on wordpress
5. No need to use the values of images below I will manually add those once installed. So it can start off with no images.
6. Short code to insert onto page.


----

<script>(function run() {
  const seconds  = 2;
  const images = [
    // Make % number smaller to move down
    ["/wp-content/uploads/2026/01/PIC_-1.jpg", "35%"],
    ["/wp-content/uploads/2026/01/PIC_-2.jpg", "35%"],
    ["/wp-content/uploads/2026/01/PIC_-3.jpg", "50%"],
    ["/wp-content/uploads/2026/01/PIC_-4.jpg", "20%"],
    ["/wp-content/uploads/2026/01/PIC_-5.jpg", "35%"],
    ["/wp-content/uploads/2026/01/PIC_-6.jpg", "35%"],
    ["/wp-content/uploads/2026/01/PIC_-7.jpg", "10%"],
    ["/wp-content/uploads/2026/01/PIC_-8.jpg", "35%"],
    ["/wp-content/uploads/2026/01/PIC_-9.jpg", "35%"],
  ];

  const slideshowDiv = document.querySelector(".slideshow1");
  if (!slideshowDiv) return;

  function createInnerDiv() {
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("inner");
    slideshowDiv.appendChild(innerDiv);

    innerDiv.style.backgroundRepeat = "no-repeat";
    innerDiv.style.backgroundSize = "cover";

    innerDiv.style.position = "absolute";
    innerDiv.style.height = "100%";
    innerDiv.style.width = "100%";
    innerDiv.style.left = "0";
    innerDiv.style.top = "0"; 
    return innerDiv;
  }

  const innerDiv1 = createInnerDiv();
  const innerDiv2 = createInnerDiv();

  let nextIndexToLoad = 2;
  let innerDivCurr = 1;

  function updateBackground() {
    // Show the other div
    currDiv = innerDivCurr === 1 ? innerDiv1 : innerDiv2;
    otherDiv = innerDivCurr === 1 ? innerDiv2 : innerDiv1;

    currDiv.style.zIndex = "-100";
    otherDiv.style.zIndex = "-99";

    // Set the hidden div to the next image
    currDiv.style.backgroundImage = `url('${images[nextIndexToLoad][0]}')`;
    currDiv.style.backgroundPositionY = images[nextIndexToLoad][1];

    innerDivCurr = innerDivCurr === 1 ? 2 : 1;
    nextIndexToLoad = (nextIndexToLoad + 1) % images.length;
  }
 
  innerDiv1.style.backgroundImage = `url('${images[0][0]}')`;
  innerDiv1.style.backgroundPositionY = images[0][1];
  innerDiv1.style.zIndex = "-99";
  
  innerDiv2.style.backgroundImage = `url('${images[1][0]}')`;
  innerDiv2.style.backgroundPositionY = images[1][1];
  innerDiv2.style.zIndex = "-100";
  
  setInterval(updateBackground, seconds * 1000);
})();


</script>