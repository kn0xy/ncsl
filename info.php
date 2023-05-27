<?php
$pageTitle = "Info";
include('header.php');
include('db.php');

// Get info content
$infoContent = array();
$getInfo = mysqli_query($knoxyConn, "SELECT element,content FROM pages WHERE parent='info'") or die(mysqli_error($knoxyConn));
while($ic = mysqli_fetch_assoc($getInfo)) {
    $icKey = $ic['element'];
    $infoContent[$icKey] = $ic['content'];
}

if(!$ajaxNavRequest) {
?>
    <!-- Main -->
    <div id="mainContentWrapper">
<?php }?>
      <div id="main" class="<?php echo $pageTitle;?>"<?php if($ajaxNavRequest) echo ' style="display:none"';?>>
        <div class="container">
            <div class="row"> 
                <!-- Content -->
                <div id="content" class="4u skel-cell-important">
                    
                    <section style="margin-bottom:0 !important">
                        <header>
                            <h2>Info</h2>
                            <span class="byline">About Us</span>
                            
                        </header>
                            
                    </section>
                </div>
                <div id="infoFilterWrap" class="8u">
                    <div id="infoFilter">
                        <ul id="infoFilterGuide">
                            <li class="selected">About Us</li>
                            <li>Locations</li>
                            <li>Rules</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="infoContent-aboutus" class="infoContent" style="display:block">
                    <?php echo $infoContent['aboutus'];?>
                </div>
                <div id="infoContent-locations" class="infoContent">
                    <?php echo $infoContent['locations'];?>
                </div>
                <div id="infoContent-rules" class="infoContent">
                    <?php echo $infoContent['rules'];?>
                </div>
            </div>
        </div>
      </div>
    <?php if(!$ajaxNavRequest) echo "    </div>\n";
include('footer.php');
?>