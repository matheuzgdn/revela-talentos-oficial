Add-Type -AssemblyName System.Drawing

$OutputDir = 'C:\Users\Admin\revela\revela-talentos\generated-images'
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$OutputPath = Join-Path $OutputDir 'flyer-social-proof-atletas-horizontal.png'

$Width = 1920
$Height = 1080
$Bitmap = New-Object System.Drawing.Bitmap -ArgumentList $Width, $Height
$Graphics = [System.Drawing.Graphics]::FromImage($Bitmap)

function New-Color([int]$A, [int]$R, [int]$G, [int]$B) {
  [System.Drawing.Color]::FromArgb($A, $R, $G, $B)
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

function Draw-TextPath($G, [string]$Text, [string]$FontName, [float]$FontSize, [System.Drawing.PointF]$Origin, $Brush, $GlowColor, [float]$OutlineWidth = 0, $OutlineColor = $null) {
  $family = New-Object System.Drawing.FontFamily -ArgumentList $FontName
  $format = New-Object System.Drawing.StringFormat
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::NoClip

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddString($Text, $family, [int][System.Drawing.FontStyle]::Regular, $FontSize, $Origin, $format)

  if ($GlowColor) {
    for ($i = 7; $i -ge 1; $i--) {
      $penGlow = New-Object System.Drawing.Pen -ArgumentList ([System.Drawing.Color]::FromArgb([int](8 + ($i * 6)), $GlowColor.R, $GlowColor.G, $GlowColor.B)), ($OutlineWidth + $i * 2.4)
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

function Draw-LabelText($G, [string]$Text, [string]$FontName, [float]$FontSize, [System.Drawing.Brush]$Brush, [float]$X, [float]$Y) {
  $font = New-Object System.Drawing.Font -ArgumentList $FontName, $FontSize, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $G.DrawString($Text, $font, $Brush, $X, $Y)
  $font.Dispose()
}

$Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$Graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$Graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$Graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

try {
  $Graphics.Clear((New-Color 255 3 6 14))

  $fullRect = New-Object System.Drawing.Rectangle -ArgumentList 0, 0, $Width, $Height
  $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $fullRect, (New-Color 255 6 10 20), (New-Color 255 1 3 9), ([single]22.0)
  $Graphics.FillRectangle($bgBrush, $fullRect)
  $bgBrush.Dispose()

  Draw-GlowCircle $Graphics 280 200 520 (New-Color 36 0 180 255) 24
  Draw-GlowCircle $Graphics 640 940 560 (New-Color 22 0 130 255) 20
  Draw-GlowCircle $Graphics 1520 300 620 (New-Color 28 56 189 248) 24
  Draw-GlowCircle $Graphics 1610 870 620 (New-Color 30 0 110 255) 24

  $gridPen = New-Object System.Drawing.Pen -ArgumentList (New-Color 18 56 189 248), 1
  for ($x = 0; $x -le $Width; $x += 64) {
    $Graphics.DrawLine($gridPen, $x, 0, $x, $Height)
  }
  for ($y = 0; $y -le $Height; $y += 64) {
    $Graphics.DrawLine($gridPen, 0, $y, $Width, $y)
  }
  $gridPen.Dispose()

  $beam1 = [System.Drawing.Point[]]@(
    (New-Object System.Drawing.Point -ArgumentList 1180, 0),
    (New-Object System.Drawing.Point -ArgumentList 1450, 0),
    (New-Object System.Drawing.Point -ArgumentList 990, 1080),
    (New-Object System.Drawing.Point -ArgumentList 790, 1080)
  )
  $beamBrush1 = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 8 56 189 248)
  $Graphics.FillPolygon($beamBrush1, $beam1)
  $beamBrush1.Dispose()

  $beam2 = [System.Drawing.Point[]]@(
    (New-Object System.Drawing.Point -ArgumentList 1490, 0),
    (New-Object System.Drawing.Point -ArgumentList 1730, 0),
    (New-Object System.Drawing.Point -ArgumentList 1280, 1080),
    (New-Object System.Drawing.Point -ArgumentList 1100, 1080)
  )
  $beamBrush2 = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 5 255 255 255)
  $Graphics.FillPolygon($beamBrush2, $beam2)
  $beamBrush2.Dispose()

  $topPen = New-Object System.Drawing.Pen -ArgumentList (New-Color 120 56 189 248), 3
  $Graphics.DrawLine($topPen, 70, 86, 720, 86)
  $Graphics.DrawLine($topPen, 1160, 86, 1840, 86)
  $topPen.Dispose()

  $headlineBrush1 = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList (New-Object System.Drawing.Rectangle -ArgumentList 76, 170, 900, 140), (New-Color 255 255 255 255), (New-Color 255 90 220 255), ([single]0.0)
  $headlineBrush2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList (New-Object System.Drawing.Rectangle -ArgumentList 76, 300, 900, 160), (New-Color 255 255 255 255), (New-Color 255 56 189 248), ([single]0.0)
  $smallBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 220 190 235 255)
  $mutedBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 180 145 190 215)
  $pillTextBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 230 220 245 255)

  $pillRect = New-Object System.Drawing.RectangleF -ArgumentList 74.0, 118.0, 420.0, 48.0
  $pillPath = Draw-RoundedRect $Graphics $pillRect 22 (New-Color 34 5 14 30) (New-Color 88 56 189 248) 1.6
  Draw-LabelText $Graphics 'REVELA TALENTOS | SOCIAL PROOF' 'Segoe UI Semibold' 18 $pillTextBrush 102 131

  Draw-TextPath $Graphics 'PROVAS SOCIAIS' 'Arial Black' 96 (New-Object System.Drawing.PointF -ArgumentList 78.0, 186.0) $headlineBrush1 (New-Color 135 56 189 248) 1.4 (New-Color 40 255 255 255)
  Draw-TextPath $Graphics 'DOS ATLETAS' 'Arial Black' 110 (New-Object System.Drawing.PointF -ArgumentList 78.0, 318.0) $headlineBrush2 (New-Color 145 56 189 248) 1.4 (New-Color 38 255 255 255)

  Draw-LabelText $Graphics 'Flyer horizontal inspirado na lead page da plataforma' 'Segoe UI' 28 $smallBrush 84 496
  Draw-LabelText $Graphics '5.0 de avaliacao | 12.3 mil reviews | 1200+ atletas | 800+ oportunidades | 18 paises | 85% de sucesso' 'Segoe UI Semibold' 24 $mutedBrush 84 536

  $chip1 = New-Object System.Drawing.RectangleF -ArgumentList 84.0, 590.0, 184.0, 74.0
  $chip2 = New-Object System.Drawing.RectangleF -ArgumentList 286.0, 590.0, 250.0, 74.0
  $chip3 = New-Object System.Drawing.RectangleF -ArgumentList 556.0, 590.0, 280.0, 74.0
  $chip4 = New-Object System.Drawing.RectangleF -ArgumentList 84.0, 684.0, 360.0, 74.0
  $chip5 = New-Object System.Drawing.RectangleF -ArgumentList 464.0, 684.0, 372.0, 74.0

  $chip1Path = Draw-RoundedRect $Graphics $chip1 22 (New-Color 40 4 12 24) (New-Color 90 56 189 248) 1.6
  $chip2Path = Draw-RoundedRect $Graphics $chip2 22 (New-Color 40 4 12 24) (New-Color 90 56 189 248) 1.6
  $chip3Path = Draw-RoundedRect $Graphics $chip3 22 (New-Color 40 4 12 24) (New-Color 90 56 189 248) 1.6
  $chip4Path = Draw-RoundedRect $Graphics $chip4 22 (New-Color 40 4 12 24) (New-Color 90 56 189 248) 1.6
  $chip5Path = Draw-RoundedRect $Graphics $chip5 22 (New-Color 40 4 12 24) (New-Color 90 56 189 248) 1.6

  Draw-LabelText $Graphics '5.0' 'Arial Black' 34 $smallBrush 110 610
  Draw-LabelText $Graphics 'AVALIACAO' 'Segoe UI Semibold' 16 $mutedBrush 110 643

  Draw-LabelText $Graphics '12.3 MIL' 'Arial Black' 30 $smallBrush 312 612
  Draw-LabelText $Graphics 'REVIEWS DA LANDING' 'Segoe UI Semibold' 16 $mutedBrush 312 643

  Draw-LabelText $Graphics '85%' 'Arial Black' 30 $smallBrush 580 612
  Draw-LabelText $Graphics 'TAXA DE SUCESSO' 'Segoe UI Semibold' 16 $mutedBrush 580 643

  Draw-LabelText $Graphics '1200+' 'Arial Black' 30 $smallBrush 110 706
  Draw-LabelText $Graphics 'ATLETAS CONECTADOS' 'Segoe UI Semibold' 16 $mutedBrush 110 738

  Draw-LabelText $Graphics '800+ OPORTUNIDADES | 18 PAISES' 'Arial Black' 24 $smallBrush 490 709
  Draw-LabelText $Graphics 'REDE GLOBAL DE CONTATOS' 'Segoe UI Semibold' 16 $mutedBrush 490 739

  $ctaRect = New-Object System.Drawing.RectangleF -ArgumentList 84.0, 812.0, 760.0, 142.0
  $ctaPath = Draw-RoundedRect $Graphics $ctaRect 30 (New-Color 34 3 10 22) (New-Color 100 56 189 248) 1.8
  Draw-LabelText $Graphics 'JUNTE-SE A CENTENAS DE ATLETAS QUE JA ESTAO' 'Segoe UI Semibold' 22 $mutedBrush 118 842
  Draw-LabelText $Graphics 'TRANSFORMANDO SEUS SONHOS EM REALIDADE' 'Arial Black' 34 $smallBrush 118 875

  $panelRect = New-Object System.Drawing.RectangleF -ArgumentList 1020.0, 132.0, 816.0, 820.0
  $panelPath = Draw-RoundedRect $Graphics $panelRect 36 (New-Color 26 7 17 31) (New-Color 92 56 189 248) 2.0
  $panelGlow = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList (New-Object System.Drawing.Rectangle -ArgumentList 1020, 132, 816, 820), (New-Color 14 255 255 255), (New-Color 0 255 255 255), ([single]90.0)
  $Graphics.FillPath($panelGlow, $panelPath)
  $panelGlow.Dispose()

  $panelPillRect = New-Object System.Drawing.RectangleF -ArgumentList 1064.0, 166.0, 286.0, 44.0
  $panelPillPath = Draw-RoundedRect $Graphics $panelPillRect 20 (New-Color 42 5 14 30) (New-Color 84 56 189 248) 1.4
  Draw-LabelText $Graphics 'LEAD PAGE DOS ATLETAS' 'Segoe UI Semibold' 16 $pillTextBrush 1090 177

  Draw-LabelText $Graphics 'RESULTADOS QUE JA GERAM CONFIANCA' 'Arial Black' 34 $smallBrush 1064 236
  Draw-LabelText $Graphics 'Cases e provas sociais visiveis na landing da plataforma' 'Segoe UI' 22 $mutedBrush 1066 282

  $caseY = 334
  $caseGap = 176
  $caseWidth = 726.0
  $caseHeight = 142.0
  $caseData = @(
    @{
      Badge = 'CONTRATADO'
      Scout = 'SCOUT ID 8942'
      Name = 'MATHEUS ALVES'
      Meta = 'Extremo Esquerdo | 18 anos'
      Desc = 'Aprovado na base de um gigante paulista em 4 semanas.'
    },
    @{
      Badge = 'PRO'
      Scout = 'SCOUT ID 7102'
      Name = 'JOAO "FOGUETE"'
      Meta = 'Lateral Direito | 17 anos'
      Desc = 'Velocidade maxima chamou atencao europeia e virou contrato profissional.'
    },
    @{
      Badge = 'EUROPA'
      Scout = 'SCOUT ID 9021'
      Name = 'LUCAS PEREIRA'
      Meta = 'Medio Centro | 19 anos'
      Desc = 'Entrou no radar internacional pelo perfil analitico e leitura de jogo.'
    }
  )

  $caseIndex = 0
  foreach ($case in $caseData) {
    $y = $caseY + ($caseIndex * $caseGap)
    $caseRect = New-Object System.Drawing.RectangleF -ArgumentList 1060.0, ([single]$y), $caseWidth, $caseHeight
    $casePath = Draw-RoundedRect $Graphics $caseRect 28 (New-Color 46 4 11 22) (New-Color 78 56 189 248) 1.6
    Draw-GlowCircle $Graphics 1730 ($y + 72) 64 (New-Color 28 56 189 248) 10

    $badgeRect = New-Object System.Drawing.RectangleF -ArgumentList 1086.0, ([single]($y + 24)), 156.0, 30.0
    $badgePath = Draw-RoundedRect $Graphics $badgeRect 14 (New-Color 44 8 32 56) (New-Color 96 56 189 248) 1.2
    Draw-LabelText $Graphics $case.Badge 'Segoe UI Semibold' 14 $smallBrush 1116 ($y + 29)
    Draw-LabelText $Graphics $case.Scout 'Segoe UI Semibold' 13 $mutedBrush 1270 ($y + 30)
    Draw-LabelText $Graphics $case.Name 'Arial Black' 28 $smallBrush 1086 ($y + 62)
    Draw-LabelText $Graphics $case.Meta 'Segoe UI Semibold' 16 $mutedBrush 1088 ($y + 96)
    Draw-LabelText $Graphics $case.Desc 'Segoe UI' 18 $smallBrush 1088 ($y + 118)
    $badgePath.Dispose()
    $casePath.Dispose()
    $caseIndex++
  }

  $footerRect = New-Object System.Drawing.RectangleF -ArgumentList 1060.0, 870.0, 726.0, 54.0
  $footerPath = Draw-RoundedRect $Graphics $footerRect 22 (New-Color 34 4 11 22) (New-Color 78 56 189 248) 1.4
  Draw-LabelText $Graphics 'Black + azul neon | design inspirado no universo visual Revela Talentos' 'Segoe UI Semibold' 17 $mutedBrush 1092 886

  $edgeBrush = New-Object System.Drawing.SolidBrush -ArgumentList (New-Color 36 0 0 0)
  $Graphics.FillRectangle($edgeBrush, 0, 0, 36, $Height)
  $Graphics.FillRectangle($edgeBrush, $Width - 36, 0, 36, $Height)
  $Graphics.FillRectangle($edgeBrush, 0, 0, $Width, 28)
  $Graphics.FillRectangle($edgeBrush, 0, $Height - 28, $Width, 28)
  $edgeBrush.Dispose()

  $headlineBrush1.Dispose()
  $headlineBrush2.Dispose()
  $smallBrush.Dispose()
  $mutedBrush.Dispose()
  $pillTextBrush.Dispose()

  $pillPath.Dispose()
  $chip1Path.Dispose()
  $chip2Path.Dispose()
  $chip3Path.Dispose()
  $chip4Path.Dispose()
  $chip5Path.Dispose()
  $ctaPath.Dispose()
  $panelPath.Dispose()
  $panelPillPath.Dispose()
  $footerPath.Dispose()

  $Bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $OutputPath
}
finally {
  $Graphics.Dispose()
  $Bitmap.Dispose()
}
