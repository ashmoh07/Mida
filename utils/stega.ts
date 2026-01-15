
/**
 * LSB Steganography Engine - Pro Version
 * Structure: [Marker 'MIDA'][HeaderLen(4b)][HeaderBytes][PayloadLen(4b)][PayloadBytes]
 */

interface FileMetadata {
  name: string;
  type: string;
}

const MARKER = "MIDA";

export async function hideDataInImage(imageFile: File, payload: Uint8Array, metadata: FileMetadata): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        // استخدام سياق 2D مع تعطيل تحسينات الألوان لضمان دقة البتات
        const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
        if (!ctx) return reject('فشل إنشاء سياق الرسم.');
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // تجهيز البيانات
        const encoder = new TextEncoder();
        const markerBytes = encoder.encode(MARKER);
        const headerBytes = encoder.encode(JSON.stringify(metadata));
        
        const totalSize = markerBytes.length + 4 + headerBytes.length + 4 + payload.length;
        const finalBuffer = new Uint8Array(totalSize);
        const view = new DataView(finalBuffer.buffer);
        
        let offset = 0;
        // 1. الماركر
        finalBuffer.set(markerBytes, offset);
        offset += markerBytes.length;
        // 2. طول الهيدر
        view.setUint32(offset, headerBytes.length); 
        offset += 4;
        // 3. الهيدر نفسه
        finalBuffer.set(headerBytes, offset);
        offset += headerBytes.length;
        // 4. طول البيانات المشفرة
        view.setUint32(offset, payload.length);
        offset += 4;
        // 5. البيانات المشفرة
        finalBuffer.set(payload, offset);

        const availableBits = (pixels.length / 4) * 3;
        if (finalBuffer.length * 8 > availableBits) {
          return reject(`الصورة صغيرة جداً! المساحة المتاحة لا تكفي لتخزين هذا الملف.`);
        }

        // حقن البتات (LSB)
        let bitIndex = 0;
        const totalBits = finalBuffer.length * 8;

        for (let i = 0; i < pixels.length && bitIndex < totalBits; i++) {
          if ((i + 1) % 4 === 0) continue; // تخطي قناة Alpha

          const byteIdx = Math.floor(bitIndex / 8);
          const bitPos = 7 - (bitIndex % 8);
          const bit = (finalBuffer[byteIdx] >> bitPos) & 1;
          
          pixels[i] = (pixels[i] & 0xFE) | bit;
          bitIndex++;
        }

        ctx.putImageData(imageData, 0, 0);
        // التصدير دائماً PNG لأن JPEG يضغط البيانات ويتلف البتات
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  });
}

export async function extractDataFromImage(imageFile: File): Promise<{ data: Uint8Array, name: string, type: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
        if (!ctx) return reject('سياق الرسم غير متاح.');

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let pixelPointer = 0;
        const getBytes = (count: number) => {
          const result = new Uint8Array(count);
          let bitCount = 0;
          const totalBitsNeeded = count * 8;

          while (bitCount < totalBitsNeeded) {
            if (pixelPointer >= pixels.length) break;
            if ((pixelPointer + 1) % 4 === 0) {
              pixelPointer++;
              continue;
            }

            const bit = pixels[pixelPointer] & 1;
            const byteIdx = Math.floor(bitCount / 8);
            const bitPos = 7 - (bitCount % 8);
            
            result[byteIdx] |= (bit << bitPos);
            
            bitCount++;
            pixelPointer++;
          }
          return result;
        };

        try {
          // 1. قراءة الماركر للتحقق
          const markerBytes = getBytes(MARKER.length);
          const extractedMarker = new TextDecoder().decode(markerBytes);
          if (extractedMarker !== MARKER) {
            throw new Error("هذه الصورة لا تحتوي على بيانات مخفية بواسطة تطبيق ميدأ.");
          }

          // 2. قراءة طول الهيدر
          const headerLenBytes = getBytes(4);
          const headerLen = new DataView(headerLenBytes.buffer).getUint32(0);
          if (headerLen === 0 || headerLen > 10000) throw new Error("بيانات وصفية غير صالحة.");

          // 3. قراءة الهيدر
          const headerBytes = getBytes(headerLen);
          const metadata = JSON.parse(new TextDecoder().decode(headerBytes)) as FileMetadata;

          // 4. قراءة طول البيانات
          const payloadLenBytes = getBytes(4);
          const payloadLen = new DataView(payloadLenBytes.buffer).getUint32(0);
          if (payloadLen === 0) throw new Error("لا توجد بيانات مشفرة.");

          // 5. قراءة البيانات الفعلية
          const payload = getBytes(payloadLen);

          resolve({
            data: payload,
            name: metadata.name,
            type: metadata.type
          });
        } catch (err: any) {
          reject(err.message || 'فشل استخراج البيانات. قد تكون الصورة تالفة أو تم التعديل عليها.');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  });
}
