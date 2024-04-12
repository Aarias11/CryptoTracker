import { useState, useEffect, useRef } from "react";

// Custom hook to follow the pointer within a component
export function useFollowPointer(ref) {
    const [point, setPoint] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!ref.current) return;

        const handlePointerMove = (event) => {
            const { clientX, clientY } = event;
            const { left, top, width, height } = ref.current.getBoundingClientRect();

            // Calculate cursor position relative to the container
            const relativeX = clientX - left;
            const relativeY = clientY - top;

            // Check if the cursor is inside the container
            if (relativeX >= 0 && relativeX <= width && relativeY >= 0 && relativeY <= height) {
                setPoint({ x: relativeX - width / 2, y: relativeY - height / 2 });
            } else {
                // Reset position when the cursor is outside the container
                setPoint({ x: 0, y: 0 });
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, [ref]);

  return point;
}

// Example component to demonstrate the usage of useFollowPointer
const FollowPointerComponent = () => {
  const targetRef = useRef(null);
  const { x, y } = useFollowPointer(targetRef);

  return (
    <div ref={targetRef} style={{ width: '100px', height: '100px', background: 'red' }}>
      Pointer position relative to the element: X: {x}, Y: {y}
    </div>
  );
};

export default FollowPointerComponent;
