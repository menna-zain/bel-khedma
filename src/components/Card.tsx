"use client";


type Props = {
  title?: string;
  subtitle?: string;
  price?: number;
  image?: string;
  onDelete?: () => void;
};
export default function Card({
  title,
  subtitle,
  price,
  image,
  onDelete,
}: Props) {
  return (
    <div className="border p-4 rounded-xl mb-4">
      <img src={image} className="w-full h-40 object-cover rounded-lg" />

      <h2 className="text-lg font-bold">{title}</h2>
      <p>{subtitle}</p>
      <p>{price} EGP</p>

      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
      >
        Delete
      </button>
    </div>
  );



  // return (
  //   <div className="border rounded-xl p-4 flex items-center justify-between mb-4">
  //     <div className="flex items-center gap-4">
  //       <div className="w-16 h-12 bg-gray-300 rounded" />
  //       <div className="w-40 h-3 bg-gray-300 rounded" />
  //     </div>

  //     <div className="flex gap-2">
  //       <button className="text-red-500">👁</button>
  //       <button className="text-blue-500">✏️</button>
  //     </div>
  //   </div>
  // );
}