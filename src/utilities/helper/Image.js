import sharp from 'sharp'


export const compressBase64Image = async (base64Image) => {
  // Convert Base64 to Buffer
  const imageBuffer = Buffer.from(base64Image, 'base64')
  let quality = 90 // Initial quality value
  let hight = 600
  let width = 600
  const targetFileMaxLimit = 12 * 1024 // 12 KB

  let outputBuffer = await sharp(imageBuffer)
    .resize(hight, width) // Set the desired dimensions
    .jpeg({ quality: quality }) // Compress as JPEG with initial quality
    .toBuffer()
  // Perform iterative resizing and compression until the desired file size is achieved
  if (outputBuffer.length / 1024 > 12 || outputBuffer.length / 1024 < 4) {
    while (outputBuffer.length > targetFileMaxLimit && quality > 10) {
      quality -= 10 // Decrease the quality value by 10
      outputBuffer = await sharp(imageBuffer)
        .resize(hight, width) // Set the desired dimensions
        .jpeg({ quality: quality }) // Compress as JPEG with updated quality
        .toBuffer()
    }

    while (
      outputBuffer.length > targetFileMaxLimit &&
      hight > 50 &&
      width > 50
    ) {
      hight = (hight * 3) / 4
      width = (width * 3) / 4
      quality = 50
      outputBuffer = await sharp(imageBuffer)
        .resize(hight, width) // Set the desired dimensions
        .jpeg({ quality: quality }) // Compress as JPEG with updated quality
        .toBuffer()
    }
  }

  return outputBuffer.toString('base64')
}
