-- 팬톤 컬러 테이블 생성
CREATE TABLE pantone_colors (
  id       TEXT    PRIMARY KEY,
  code     TEXT    NOT NULL,
  name     TEXT    NOT NULL,
  hex      CHAR(7) NOT NULL,
  category TEXT    NOT NULL,
  year     SMALLINT
);

-- 카테고리 필터 인덱스
CREATE INDEX idx_pantone_category ON pantone_colors (category);

-- 올해의 컬러 조회 인덱스 (year가 있는 행만)
CREATE INDEX idx_pantone_year ON pantone_colors (year)
  WHERE year IS NOT NULL;

-- 이름·코드 전문 검색 인덱스
CREATE INDEX idx_pantone_search ON pantone_colors
  USING gin(to_tsvector('english', name || ' ' || code));

-- RLS 활성화 (공개 읽기 전용)
ALTER TABLE pantone_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON pantone_colors
  FOR SELECT USING (true);
