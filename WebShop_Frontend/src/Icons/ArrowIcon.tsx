const ArrowIcon = ({ isVisible }: { isVisible: boolean }) => (
    <svg className='arrowIcon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d={isVisible ? "M12 8l-6 6h12l-6-6z" : "M12 16l6-6H6l6 6z"}
      />
    </svg>
  );

  export default ArrowIcon;