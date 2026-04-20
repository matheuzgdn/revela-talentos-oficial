Add-Type -AssemblyName System.Drawing

$OutputDir = 'C:\Users\Admin\revela\revela-talentos\generated-images'
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$OutputPath = Join-Path $OutputDir 'revela-talentos-cup-internacional-edicao-nova-lima.png'

$Width = 1920
$Height = 1080
$Bitmap = New-Object System.Drawing.Bitmap -ArgumentList $Width, $Height
$Graphics = [System.Drawing.Graphics]::FromImage($Bitmap)

function New-Color([int]$A, [int]$R, [int]$G, [int]$B) {
  [System.Drawing.Color]::FromArgb($A, $R, $G, $B)
}

function Draw-GlowCircle($G, [float]$Cx, [float]$Cy, [float]$Radius, [System.Drawing.Color]$Color, [int]$Steps = 18) {
  for ($i = $Steps; $i -ge 1; $i--) {
    $factor = $i / [float]$Steps
    $alpha = [int]([Math]::Max(2, $Color.A * ($factor * $factor) * 0.45))
    $size = $Radius * (0.55 + (1.45 * $factor))
    $brush = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb($alpha, $Color.R, $Color.G, $Color.B))
    $G.FillEllipse($brush, $Cx - $size / 2, $Cy - $size / 2, $size, $size)
    $brush.Dispose()
  }
}

function New-RoundedRectPath([System.Drawing.RectangleF]$Rect, [float]$Radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  $path
}

function Draw-RoundedRect($G, [System.Drawing.RectangleF]$Rect, [float]$Radius, $FillColor, $BorderColor, [float]$BorderWidth = 2) {
  $path = New-RoundedRectPath $Rect $Radius

  if ($FillColor) {
    $fill = New-Object System.Drawing.SolidBrush -ArgumentList $FillColor
    $G.FillPath($fill, $path)
    $fill.Dispose()
  }

  if ($BorderColor) {
    $pen = New-Object System.Drawing.Pen -ArgumentList $BorderColor, $BorderWidth
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $G.DrawPath($pen, $path)
    $pen.Dispose()
  }

  $path
}

function Draw-TextPath($G, [string]$Text, [string]$FontName, [float]$FontSize, [System.Drawing.PointF]$Origin, $Brush, $GlowColor, [float]$OutlineWidth = 0, $OutlineColor = $null) {
  $family = New-Object System.Drawing.FontFamily -ArgumentList $FontName
  $format = New-Object System.Drawing.StringFormat
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::NoClip

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddString($Text, $family, [int][System.Drawing.FontStyle]::Regular, $FontSize, $Origin, $format)

  if ($GlowColor) {
    for ($i = 8; $i -ge 1; $i--) {
      $penGlow = New-Object System.Drawing.Pen -ArgumentList ([System.Drawing.Color]::FromArgb([int](8 + ($i * 5)), $GlowColor.R, $GlowColor.G, $GlowColor.B)), ($OutlineWidth + $i * 2.2)
      $penGlow.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
      $G.DrawPath($penGlow, $path)
      $penGlow.Dispose()
    }
  }

  $G.FillPath($Brush, $path)

  if ($OutlineWidth -gt 0 -and $OutlineColor) {
    $pen = New-Object System.Drawing.Pen -ArgumentList $OutlineColor, $OutlineWidth
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $G.DrawPath($pen, $path)
    $pen.Dispose()
  }

  $path.Dispose()
  $format.Dispose()
  $family.Dispose()
}

$Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$Graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$Graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$Graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

try {
  $Graphics.Clear((New-Color 255 2 4 10))

  $fullRect = New-Object System.Drawing.Rectangle -ArgumentList 0, 0, $Width, $Height
  $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $fullRect, (New-Color 255 4 10 20), (New-Color 255 1 3 7), ([single]18.0)
  $Graphics.FillRectangle($bgBrush, $fullRect)
  $bgBrush.Dispose()

  Draw-GlowCircle $Graphics 340 250 420 (New-Color 42 0 168 225) 22
  Draw-GlowCircle $Graphics 1560 420 560 (New-Color 34 56 189 248) 22
  Draw-GlowCircle $Graphics 1320 860 420 (New-Color 26 0 102 255) 18
  Draw-GlowCircle $Graphics 760 980 340 (New-Color 18 0 229 255) 14

  $gridPen = New-Object System.Drawing.Pen -ArgumentList (New-Color 14 56 189 248), 1
  for ($x = 0; $x -le $Width; $x += 64) {
    $Graphics.DrawLine($gridPen, $x, 0, $x, $Height)
  }
  for ($y = 0; $y -le $Height; $y += 64) {
    $Graphics.DrawLine($gridPen, 0, $y, $Width, $y)
  }
  $gridPen.Dispose()

  $beam1 = [System.Drawing.Point[]]@(
    (New-Object System.Drawing.Point -ArgumentList 1120, 0),
    (New-Object System.Drawing.Point -ArgumentList 1440, 0),
    (New-Object System.Drawing.Point -ArgumentList 960, 1080),
    (New-Object System.Drawing.Point -ArgumentList 720, 1080)
  )
  $beamBrush1 = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 8 56 189 248)
  $Graphics.FillPolygon($beamBrush1, $beam1)
  $beamBrush1.Dispose()

  $beam2 = [System.Drawing.Point[]]@(
    (New-Object System.Drawing.Point -ArgumentList 1460, 0),
    (New-Object System.Drawing.Point -ArgumentList 1720, 0),
    (New-Object System.Drawing.Point -ArgumentList 1240, 1080),
    (New-Object System.Drawing.Point -ArgumentList 1040, 1080)
  )
  $beamBrush2 = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 5 255 255 255)
  $Graphics.FillPolygon($beamBrush2, $beam2)
  $beamBrush2.Dispose()

  $leftShadeRect = New-Object System.Drawing.Rectangle -ArgumentList 0, 0, 1180, $Height
  $leftShade = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $leftShadeRect, (New-Color 110 0 0 0), (New-Color 8 0 0 0), ([single]0.0)
  $Graphics.FillRectangle($leftShade, $leftShadeRect)
  $leftShade.Dispose()

  $topPen = New-Object System.Drawing.Pen -ArgumentList (New-Color 130 56 189 248), 3
  $Graphics.DrawLine($topPen, 90, 86, 760, 86)
  $Graphics.DrawLine($topPen, 1150, 86, 1820, 86)
  $topPen.Dispose()

  $bottomPen = New-Object System.Drawing.Pen -ArgumentList (New-Color 90 56 189 248), 2
  $Graphics.DrawLine($bottomPen, 110, 970, 840, 970)
  $bottomPen.Dispose()

  $fieldPen = New-Object System.Drawing.Pen -ArgumentList (New-Color 40 255 255 255), 2
  $Graphics.DrawArc($fieldPen, -160, 560, 880, 880, 284, 112)
  $Graphics.DrawArc($fieldPen, 80, 660, 380, 380, 288, 100)
  $Graphics.DrawLine($fieldPen, 92, 810, 410, 810)
  $fieldPen.Dispose()

  $panelRect = New-Object System.Drawing.RectangleF -ArgumentList 1120.0, 150.0, 670.0, 760.0
  $panelPath = Draw-RoundedRect $Graphics $panelRect 34 (New-Color 30 7 17 31) (New-Color 72 56 189 248) 2.2
  $panelHighlightRect = New-Object System.Drawing.Rectangle -ArgumentList ([int]$panelRect.X), ([int]$panelRect.Y), ([int]$panelRect.Width), ([int]$panelRect.Height)
  $panelHighlight = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $panelHighlightRect, (New-Color 14 255 255 255), (New-Color 0 255 255 255), ([single]90.0)
  $Graphics.FillPath($panelHighlight, $panelPath)
  $panelHighlight.Dispose()

  $radarPen1 = New-Object System.Drawing.Pen -ArgumentList (New-Color 70 56 189 248), 2
  $radarPen2 = New-Object System.Drawing.Pen -ArgumentList (New-Color 42 56 189 248), 1.5
  $radarPen3 = New-Object System.Drawing.Pen -ArgumentList (New-Color 24 255 255 255), 1
  $Graphics.DrawEllipse($radarPen1, 1265, 245, 385, 385)
  $Graphics.DrawEllipse($radarPen2, 1320, 300, 275, 275)
  $Graphics.DrawEllipse($radarPen2, 1375, 355, 165, 165)
  $Graphics.DrawLine($radarPen3, 1458, 220, 1458, 655)
  $Graphics.DrawLine($radarPen3, 1240, 438, 1678, 438)
  $radarPen1.Dispose()
  $radarPen2.Dispose()
  $radarPen3.Dispose()

  $linePen = New-Object System.Drawing.Pen -ArgumentList (New-Color 78 56 189 248), 3
  $linePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $Graphics.DrawLine($linePen, 1260, 360, 1345, 300)
  $Graphics.DrawLine($linePen, 1345, 300, 1458, 338)
  $Graphics.DrawLine($linePen, 1458, 338, 1565, 285)
  $Graphics.DrawLine($linePen, 1565, 285, 1635, 392)
  $Graphics.DrawLine($linePen, 1635, 392, 1558, 505)
  $Graphics.DrawLine($linePen, 1558, 505, 1442, 555)
  $Graphics.DrawLine($linePen, 1442, 555, 1325, 518)
  $Graphics.DrawLine($linePen, 1325, 518, 1228, 460)
  $Graphics.DrawLine($linePen, 1228, 460, 1260, 360)
  $Graphics.DrawLine($linePen, 1635, 392, 1690, 520)
  $linePen.Dispose()

  $nodes = @(
    @{ X = 1260; Y = 360 }, @{ X = 1345; Y = 300 }, @{ X = 1458; Y = 338 }, @{ X = 1565; Y = 285 },
    @{ X = 1635; Y = 392 }, @{ X = 1558; Y = 505 }, @{ X = 1442; Y = 555 }, @{ X = 1325; Y = 518 },
    @{ X = 1228; Y = 460 }, @{ X = 1690; Y = 520 }
  )

  foreach ($node in $nodes) {
    Draw-GlowCircle $Graphics $node.X $node.Y 30 (New-Color 48 56 189 248) 10
    $nodeBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 255 214 246 255)
    $Graphics.FillEllipse($nodeBrush, $node.X - 6, $node.Y - 6, 12, 12)
    $nodeBrush.Dispose()
  }

  $miniRect = New-Object System.Drawing.RectangleF -ArgumentList 1190.0, 690.0, 530.0, 145.0
  $miniPath = Draw-RoundedRect $Graphics $miniRect 28 (New-Color 36 3 10 22) (New-Color 56 56 189 248) 1.6
  $miniPen = New-Object System.Drawing.Pen -ArgumentList (New-Color 88 56 189 248), 3
  $miniPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $miniPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePoints = [System.Drawing.Point[]]@(
    (New-Object System.Drawing.Point -ArgumentList 1235, 785),
    (New-Object System.Drawing.Point -ArgumentList 1290, 760),
    (New-Object System.Drawing.Point -ArgumentList 1360, 775),
    (New-Object System.Drawing.Point -ArgumentList 1430, 730),
    (New-Object System.Drawing.Point -ArgumentList 1505, 742),
    (New-Object System.Drawing.Point -ArgumentList 1578, 718),
    (New-Object System.Drawing.Point -ArgumentList 1655, 735)
  )
  $Graphics.DrawLines($miniPen, $linePoints)
  $miniPen.Dispose()

  for ($i = 0; $i -lt 5; $i++) {
    $barBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color (40 + ($i * 10)) 56 189 248)
    $Graphics.FillRectangle($barBrush, 1238 + ($i * 74), 735 - (($i % 3) * 18), 38, 76 + ($i * 8))
    $barBrush.Dispose()
  }

  $titleGlowRect = New-Object System.Drawing.Rectangle -ArgumentList 96, 150, 900, 510
  $titleGlow = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $titleGlowRect, (New-Color 4 255 255 255), (New-Color 0 255 255 255), ([single]0.0)
  $Graphics.FillRectangle($titleGlow, 96, 150, 900, 510)
  $titleGlow.Dispose()

  $brush1Rect = New-Object System.Drawing.Rectangle -ArgumentList 110, 180, 860, 120
  $brush2Rect = New-Object System.Drawing.Rectangle -ArgumentList 110, 295, 900, 170
  $brush3Rect = New-Object System.Drawing.Rectangle -ArgumentList 160, 560, 600, 90
  $brush1 = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $brush1Rect, (New-Color 255 255 255 255), (New-Color 255 125 226 255), ([single]0.0)
  $brush2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $brush2Rect, (New-Color 255 255 255 255), (New-Color 255 56 189 248), ([single]0.0)
  $brush3 = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $brush3Rect, (New-Color 255 210 246 255), (New-Color 255 56 189 248), ([single]0.0)

  Draw-TextPath $Graphics 'REVELA TALENTOS CUP' 'Arial Black' 88 (New-Object System.Drawing.PointF -ArgumentList 112.0, 200.0) $brush1 (New-Color 130 56 189 248) 1.2 (New-Color 50 255 255 255)
  Draw-TextPath $Graphics 'INTERNACIONAL' 'Arial Black' 142 (New-Object System.Drawing.PointF -ArgumentList 105.0, 314.0) $brush2 (New-Color 150 56 189 248) 1.4 (New-Color 32 255 255 255)

  $subFont = New-Object System.Drawing.Font -ArgumentList 'Segoe UI Semibold', 42, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $subText = '(' + 'EDI' + [char]0x00C7 + [char]0x00C3 + 'O NOVA LIMA)'
  $subSize = $Graphics.MeasureString($subText, $subFont)
  $subRect = New-Object System.Drawing.RectangleF -ArgumentList 118.0, 560.0, ($subSize.Width + 74), 82.0
  $subPath = Draw-RoundedRect $Graphics $subRect 24 (New-Color 30 2 10 20) (New-Color 110 56 189 248) 2.2
  $Graphics.DrawString($subText, $subFont, $brush3, 152, 574)
  $subFont.Dispose()

  $accentBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 210 56 189 248)
  $Graphics.FillRectangle($accentBrush, 112, 690, 230, 8)
  $Graphics.FillRectangle($accentBrush, 112, 712, 420, 4)
  $accentBrush.Dispose()

  $edgeBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 30 0 0 0)
  $Graphics.FillRectangle($edgeBrush, 0, 0, 48, $Height)
  $Graphics.FillRectangle($edgeBrush, $Width - 48, 0, 48, $Height)
  $Graphics.FillRectangle($edgeBrush, 0, 0, $Width, 36)
  $Graphics.FillRectangle($edgeBrush, 0, $Height - 36, $Width, 36)
  $edgeBrush.Dispose()

  $brush1.Dispose()
  $brush2.Dispose()
  $brush3.Dispose()
  $miniPath.Dispose()
  $panelPath.Dispose()
  $subPath.Dispose()

  $Bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $OutputPath
}
finally {
  $Graphics.Dispose()
  $Bitmap.Dispose()
}
